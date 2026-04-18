# bun-hono-vite-solid-ssr-islands

A minimal custom metaframework (as the kids say) proof of concept using Bun, Hono, Vite, and SolidJS with islands (partial hydration).

## Project structure

```
├── src/
│   ├── css/
│   │   ├── components/          # .css files for Solid components
│   │   ├── index.css            # Global styles
│   │   └── index.ts             # CSS entry point, controls import order
│   ├── islands/                 # Client components
│   ├── index.tsx                # Server entry point
│   ├── islands-entry.tsx        # Islands entry point
│   ├── Island.tsx               # Island wrapper component with typed props
│   ├── middleware.tsx           # Middleware for SSR, including scripts, etc
│   ├── Page.tsx                 # Example page component
│   └── types.ts                 # Type extensions (Hono context, etc.)
├── .oxfmtrc.jsonc               # Formatter config
```

## How it works

Pages are server-rendered with SolidJS. Interactive parts are wrapped in an `<Island>` component that creates the enecessary markup for client-side hydration.

### Island features

- Islands can be rendered exclusively on the client with the `clientOnly` prop (no SSR rendering)
- Hydration or client-only mounting can be deferred until the element enters the viewport with the `hydrateOnVisible` prop or using a media query with `hydrateOnMedia`.
- The prop `islandProps` infers the type from the `component` prop types
- Using [`devalue`](https://github.com/sveltejs/devalue) for encoding/decoding hydration data instead of JSON to be able to include complex types like `Date` etc.

```tsx
// SSR + hydration with typed props
<Island component={CurrentTime} islandProps={{ serverTime: time }} />

// Client-only rendering
<Island component={Counter} clientOnly />

// Deferred hydration when the DOM element becomes visible
<Island component={Counter} hydrateOnVisible />
```

## Scripts

```bash
bun run dev      # Start Vite dev server
bun run build    # Build client and server bundles
bun run start    # Run production server
```
