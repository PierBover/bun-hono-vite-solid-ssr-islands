import 'hono';
import type { Component, Context } from 'solid-js';

export type ContextWithValue = {
	context: Context<any>;
	value: any;
};

declare module 'hono' {
	interface Context {
		renderSolidPage: (pageComponent: Component, pageContextWithValue?: ContextWithValue) => Promise<Response>;
	}
}
