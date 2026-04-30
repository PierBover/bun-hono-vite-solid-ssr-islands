# bun-hono-vite-solid-ssr-islands

A minimal custom metaframework (as the kids say) proof of concept using Bun, Hono, Vite, and SolidJS with islands (partial hydration).

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

### Other features

#### Link prefetch
Add a `data-prefetch` attribute to link tags so that the URLs are preloaded. Prefetch will not happen in slow networks and the HTML is only cached in the browser for a couple of seconds.

### Page contexts
There are examples on how to [inject a Solid context into the SSR'd page](https://github.com/PierBover/bun-hono-vite-solid-ssr-islands/blob/main/src/index.ts#L36) to pass stuff like data from db queries, config settings, etc.

There's also a [request context](https://github.com/PierBover/bun-hono-vite-solid-ssr-islands/blob/main/src/middleware.tsx#L21-L23) injected into all pages with stuff from the Hono context like the request path, session data, etc.

## Scripts

```bash
bun run dev      # Start Vite dev server
bun run build    # Build client and server bundles
bun run start    # Run production server
```
