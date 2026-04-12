# bun-hono-vite-solid-ssr-islands

A minimal custom metaframework proof of concept using Bun, Hono, Vite, and SolidJS with islands (partial hydration).

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

Pages are server-rendered with SolidJS. Most of the page is static HTML with zero JavaScript. Interactive parts are wrapped in an `<Island>` component that marks them for client-side hydration.

The only gotcha is that islands need to pass the component name with `name="MyComponent"`. I couldn't find an elegant way to just get the component name from a Solid component.

### Island features

- **SSR + hydration** — Server-renders the component, then hydrates on the client
- **Client-only** — Skips server rendering, mounts from scratch on the client
- **Hydrate on visible** — Defers hydration until the element enters the viewport (Intersection Observer)
- **Typed props** — Island props are inferred from the component's prop types

```tsx
// SSR + hydration with typed props
<Island component={CurrentTime} name="CurrentTime" islandProps={{ serverTime: time }} />

// Client-only rendering
<Island component={Counter} name="Counter" clientOnly />

// Deferred hydration when the DOM element becomes visible
<Island component={Counter} name="Counter" hydrateOnVisible />
```

## Scripts

```bash
bun run dev      # Start Vite dev server
bun run build    # Build client and server bundles
bun run start    # Run production server
```

## Build output

Vite produces two separate builds:

- `dist/client/` — Island JavaScript bundles and CSS, with a manifest for asset resolution
- `dist/server/` — Server bundle (Hono app)
