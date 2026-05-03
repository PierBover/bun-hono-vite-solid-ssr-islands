import {file} from 'bun';
import {createMiddleware} from 'hono/factory';
import {html, raw} from 'hono/html';
import {createComponent, generateHydrationScript, renderToString} from 'solid-js/web';
import type {Manifest, ViteDevServer} from 'vite';
import {HonoContext, type HonoContextValue} from './pages/pages-contexts';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const viteManifest = isProd ? await file('dist/client/.vite/manifest.json').text() : null;
const viteManifestJson = viteManifest ? (JSON.parse(viteManifest) as Manifest) : null;

const hydrationScript = generateHydrationScript();

export const renderSolidPage = createMiddleware(async (c, next) => {
	c.renderSolidPage = async (pageFunction, renderOptions) => {
		const {title} = renderOptions;

		// render the static HTML of the page with its context providers
		const solidHtml = renderToString(() => {
			const value: HonoContextValue = {
				path: c.req.path
			};

			return createComponent(HonoContext.Provider, {
				value: value,
				get children() {
					return pageFunction();
				}
			});
		});

		const hasIslands = solidHtml.includes('data-island-path');

		let islandsEntry = '', clientEntry = '';

		if (isDev) {
			islandsEntry = '<script type="module" src="src/islands-entry.tsx"></script>';
			clientEntry = '<script type="module" src="src/client-entry.ts"></script>';
		} else {
			islandsEntry = `<script type="module" src="${viteManifestJson!['src/islands-entry.tsx']!.file}"></script>`;
			clientEntry = `<script type="module" src="${viteManifestJson!['src/client-entry.ts']!.file}"></script>`;
		}

		const styleUrls: string[] = [];

		if (isDev) {
			const urls = await collectCssUrlsFromViteDevServer(c.env.vite);
			styleUrls.push(...urls);
		} else {
			// vite will always bundle all styles into this file
			// because of the cssCodeSplit: false setting
			const manifestEntry = viteManifestJson!['style.css'];
			styleUrls.push(manifestEntry!.file);
		}

		// dprint-ignore
		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					${isDev && raw('<script type="module" src="/@vite/client"></script>')}
					${hasIslands && raw(hydrationScript)} ${hasIslands && raw(islandsEntry)}
					${raw(clientEntry)}
					${raw(styleUrls.map((url) => `<link href="${url}" rel="stylesheet"/>`).join(''))}
					${isProd && raw(getJsPreloadTagsFromManifest())}
					<title>${title}</title>
				</head>
				<body>${raw(solidHtml)}</body>
			</html>
		`);
	};

	await next();
});

function collectCssUrlsFromViteDevServer(viteServer: ViteDevServer) {
	const cssUrls = new Set<string>();

	for (const [url, mod] of viteServer.moduleGraph.urlToModuleMap) {
		if (url.endsWith('.css')) {
			cssUrls.add(url);
		}
	}

	return cssUrls;
}

function getJsPreloadTagsFromManifest() {
	if (!viteManifestJson) throw 'No vite manifest!';
	const allFiles = Object.keys(viteManifestJson)
		.map((key) => viteManifestJson[key]!.file)
		.filter((file) => file.endsWith('.js'));
	const uniqueFiles = Array.from(new Set(allFiles));
	return uniqueFiles.map((file) => `<link rel="modulepreload" href="/${file}" fetchpriority="low">`)
		.join('');
}
