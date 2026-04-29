import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { serveStatic } from 'hono/bun';
import Home from './pages/Home.tsx';
import { renderSolidPage } from './middleware.tsx';

// CSS
// this is only for dev
import './css/index.ts';
import About from './pages/About.tsx';
import { HomeContext, type HomeContextValue } from './pages/pages-contexts.ts';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const app = new Hono();

app.use('*', renderSolidPage);

if (isProd) {
	app.use('*', compress());
	app.use('/assets/*', serveStatic({ root: './dist/client' }));
}

app.get('/', (c) => {
	const contextValue: HomeContextValue = { welcomeMessage: 'Hello context' };
	return c.renderSolidPage(Home, { context: HomeContext, value: contextValue });
});

app.get('/about', (c) => {
	return c.renderSolidPage(About);
});

export default app;
