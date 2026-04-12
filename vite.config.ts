import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import solid from 'vite-plugin-solid';

export default defineConfig(({ isSsrBuild }) => {
	return {
		plugins: [
			solid({ ssr: true }),
			devServer({
				entry: 'src/index.tsx',
				adapter: bunAdapter,
			}),
		],
		build: {
			cssCodeSplit: false,
			rollupOptions: {
				input: isSsrBuild ? 'src/index.tsx' : ['src/islands-entry.tsx', 'src/css/index.ts'],
				external: ['bun'],
			},
			outDir: isSsrBuild ? 'dist/server' : 'dist/client',
			emptyOutDir: true,
			manifest: true,
		},
	};
});
