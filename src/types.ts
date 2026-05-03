import 'hono';
import type {JSX} from 'solid-js';

export type RenderOptions = {
	title: string;
};

declare module 'hono' {
	interface Context {
		renderSolidPage: (
			pageFunction: () => JSX.Element,
			renderOptions: RenderOptions
		) => Promise<Response>;
	}
}
