import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {serveStatic} from 'hono/bun';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const app = new Hono();

if (isProd) {
	app.use('*', compress());
	app.use('/assets/*', serveStatic({ root: './dist/client' }));
}

app.get(
	'/',
	async (c) => {
		return c.body('Hello Hono!');
	}
);

export default app