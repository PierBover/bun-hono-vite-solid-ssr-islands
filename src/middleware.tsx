import { createMiddleware } from 'hono/factory';
import { html, raw } from 'hono/html';
import { generateHydrationScript, renderToString } from 'solid-js/web';
import type { ViteDevServer } from 'vite';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const hydrationScript = generateHydrationScript();

export const renderSolidPage = createMiddleware(async (c, next) => {
	c.renderSolidPage = async (jsxElement) => {
		const solidHtml = renderToString(() => jsxElement);
		const hasIslands = solidHtml.includes('data-island-name');

		let islandsEntry = '';

		if (hasIslands) {
			if (isDev) {
				islandsEntry = hydrationScript + '<script type="module" src="src/islands-entry.tsx"></script>';
			}
			// prod
		}

		const styleUrls: string[] = [];

		if (isDev) {
			const urls = await collectCssUrlsFromViteDevServer(c.env.vite, 'src/index.tsx');
			styleUrls.push(...urls);
		}

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					<script type="module" src="/@vite/client"></script>
					${raw(islandsEntry)}
					${raw(styleUrls.map((url) => `<link href="${url}" rel="stylesheet"/>`).join(''))}
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
