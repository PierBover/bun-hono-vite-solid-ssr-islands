import { defineConfig } from 'vite';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import solid from 'vite-plugin-solid';

export default defineConfig(({ isSsrBuild }) => {
	return {
		plugins: [
			solid({ ssr: true }),
			devServer({
				entry: 'src/index.ts',
				adapter: bunAdapter
			})
		],
		build: {
			cssCodeSplit: false,
			rolldownOptions: {
				input: isSsrBuild ? 'src/index.ts' : ['src/islands-entry.tsx', 'src/css/index.ts'],
				external: ['bun'],
				output: {
					minify: isSsrBuild
						? false
						: {
								compress: {
									dropConsole: true
								}
							}
				}
			},
			outDir: isSsrBuild ? 'dist/server' : 'dist/client',
			emptyOutDir: true,
			manifest: true,
			minify: isSsrBuild ? false : 'oxc'
		}
	};
});
