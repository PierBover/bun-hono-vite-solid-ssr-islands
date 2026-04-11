import { createMiddleware } from 'hono/factory';
import { html, raw } from 'hono/html';
import { generateHydrationScript, renderToString } from 'solid-js/web';

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

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					<script type="module" src="/@vite/client"></script>
					${raw(islandsEntry)}
				</head>
				<body>
					<div id="solid">${raw(solidHtml)}</div>
				</body>
			</html>
		`);
	};

	await next();
});
