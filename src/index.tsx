import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {serveStatic} from 'hono/bun';
import Page from './Page';
import {renderSolidPage} from './middleware';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const app = new Hono();

app.use('*', renderSolidPage);

if (isProd) {
	app.use('*', compress());
	app.use('/assets/*', serveStatic({ root: './dist/client' }));
}

app.get(
	'/',
	(c) => {
		return c.renderSolidPage(<Page message='Hello Solid SSR'/>);
	}
);

export default app;