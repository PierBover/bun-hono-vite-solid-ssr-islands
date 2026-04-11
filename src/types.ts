import 'hono';
import type { JSXElement } from "solid-js";


declare module 'hono' {
	interface Context {
		renderSolidPage: (
			jsxElement:JSXElement
		) => Promise<Response>;
	}
}