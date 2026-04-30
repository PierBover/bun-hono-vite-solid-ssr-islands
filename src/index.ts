import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';
import { renderSolidPage } from './middleware.tsx';
import About from './pages/About.tsx';
import Home from './pages/Home.tsx';
import { HomeContext, type HomeContextValue } from './pages/pages-contexts.ts';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

if (isDev) {
	await import('./css/styles-entry.ts');
}

const app = new Hono();

app.use('*', renderSolidPage);

if (isProd) {
	app.use('*', compress());
	app.use('/assets/*', serveStatic({ root: './dist/client' }));

	// add a short lived cache time for link preloads on mouseover
	app.use(async (context, next) => {
		await next();
		const contentTypeHeader = context.res.headers.get('Content-Type');
		const isHtmlResponse = contentTypeHeader && contentTypeHeader.includes('text/html');
		if (isHtmlResponse) context.res.headers.set('Cache-Control', 'max-age=3');
	});
}

app.get('/', (c) => {
	const contextValue: HomeContextValue = { welcomeMessage: 'Hello context' };
	return c.renderSolidPage(Home, { context: HomeContext, value: contextValue });
});

app.get('/about', (c) => {
	return c.renderSolidPage(About);
});

export default app;
