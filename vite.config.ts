import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import { defineConfig } from 'vite';
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
		server: {
			warmup: {
				clientFiles: ['src/css/styles-entry.ts']
			}
		},
		build: {
			cssCodeSplit: false,
			rolldownOptions: {
				input: isSsrBuild
					? 'src/index.ts'
					: ['src/islands-entry.tsx', 'src/client-entry.ts', 'src/css/styles-entry.ts'],
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
