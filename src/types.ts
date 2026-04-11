import 'hono';
import type { Component } from "solid-js";

declare module 'hono' {
	interface Context {
		renderSolidPage: (
			SolidComponent:Component,
			props?: Record<string, any>
		) => Promise<Response>;
	}
}