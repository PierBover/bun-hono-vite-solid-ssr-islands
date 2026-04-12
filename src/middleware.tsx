import { file } from 'bun';
import { createMiddleware } from 'hono/factory';
import { html, raw } from 'hono/html';
import { generateHydrationScript, renderToString } from 'solid-js/web';
import type { Manifest, ViteDevServer } from 'vite';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const viteManifest = isProd ? await file('dist/client/.vite/manifest.json').text() : null;
const viteManifestJson = viteManifest ? (JSON.parse(viteManifest) as Manifest) : null;

const hydrationScript = generateHydrationScript();

export const renderSolidPage = createMiddleware(async (c, next) => {
	c.renderSolidPage = async (jsxElement) => {
		const solidHtml = renderToString(() => jsxElement);
		const hasIslands = solidHtml.includes('data-island-path');

		let islandsEntry = '';

		if (isDev) {
			islandsEntry = '<script type="module" src="src/islands-entry.tsx"></script>';
		} else {
			islandsEntry = `<script type="module" src="${viteManifestJson!['src/islands-entry.tsx']!.file}"></script>`;
		}

		const styleUrls: string[] = [];

		if (isDev) {
			const urls = await collectCssUrlsFromViteDevServer(c.env.vite, 'src/index.tsx');
			styleUrls.push(...urls);
		} else {
			// vite will always bundle all styles into this file
			// because of the cssCodeSplit: false setting
			const manifestEntry = viteManifestJson!['style.css'];
			styleUrls.push(manifestEntry!.file);
		}

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					${isDev && raw('<script type="module" src="/@vite/client"></script>')}
					${hasIslands && raw(hydrationScript)} ${hasIslands && raw(islandsEntry)}
					${raw(styleUrls.map((url) => `<link href="${url}" rel="stylesheet"/>`).join(''))}
					${isProd && raw(getJsPreloadTagsFromManifest())}
				</head>
				<body>
					<div id="solid">${raw(solidHtml)}</div>
				</body>
			</html>
		`);
	};

	await next();
});

async function collectCssUrlsFromViteDevServer(viteServer: ViteDevServer, entryPath: string) {
	const cssUrls = new Set<string>();
	const module = await viteServer.moduleGraph.getModuleByUrl(entryPath);

	if (!module) return cssUrls;

	function walk(mod: any) {
		mod.importedModules.forEach((submod: any) => {
			if (submod.file?.endsWith('.css')) {
				cssUrls.add(submod.url);
			} else {
				walk(submod);
			}
		});
	}

	walk(module);
	return cssUrls;
}

function getJsPreloadTagsFromManifest() {
	if (!viteManifestJson) throw 'No vite manifest!';
	const allFiles = Object.keys(viteManifestJson)
		.map((key) => viteManifestJson[key]!.file)
		.filter((file) => file.endsWith('.js'));
	const uniqueFiles = Array.from(new Set(allFiles));
	return uniqueFiles.map((file) => `<link rel="modulepreload" href="/${file}" fetchpriority="low">`).join('');
}
