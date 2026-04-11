import {createMiddleware} from 'hono/factory'
import {html, raw} from 'hono/html';
import {renderToString} from "solid-js/web";

export const renderSolidPage = createMiddleware(async (c, next) => {

	c.renderSolidPage = async (jsxElement) => {

		const solidHtml = renderToString(() => jsxElement);

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					<script type="module" src="/@vite/client"></script>
				</head>
				<body>
					<div id="solid">${raw(solidHtml)}</div>
				</body>
			</html>
		`);
	};

	await next();
});