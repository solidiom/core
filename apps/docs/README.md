# @solidiom/docs

Documentation app for Solidiom primitives — a Vite + Solid 2 SPA.

## Architecture Decision: Vite SPA over SolidStart v2

This app is built as a plain Vite SPA with `@solidjs/router` instead of SolidStart v2.

**Reason:** As of July 2026, `@solidjs/start@2.0.0-beta.10` (the latest SolidStart release) still depends on `solid-js ^1.9.x` internally. It imports from `solid-js/web`, a subpath export that no longer exists in solid-js 2 — the web runtime moved to the separate `@solidjs/web` package. This makes SolidStart fundamentally incompatible with our workspace's `solid-js@2.0.0-beta.20`.

**Current stack:**

| Package             | Version         | Role                                                         |
| ------------------- | --------------- | ------------------------------------------------------------ |
| `solid-js`          | `2.0.0-beta.20` | Core reactivity (pinned via root `pnpm.overrides`)           |
| `@solidjs/web`      | `2.0.0-beta.20` | DOM runtime                                                  |
| `@solidjs/router`   | `0.17.0-next.5` | Client-side routing (solid-js 2 compatible)                  |
| `vite`              | `^8.1.5`        | Build tooling                                                |
| `vite-plugin-solid` | `^2.11.6`       | JSX transform (configured with `moduleName: "@solidjs/web"`) |

**Migration path:** When SolidStart ships a release that peers against solid-js 2 and imports from `@solidjs/web`, migrating is straightforward:

1. Replace `vite.config.ts` with SolidStart's `solidStart()` plugin.
2. Move `src/routes/` to match SolidStart's file-based routing conventions.
3. Convert the manual `<Router>` + `<Route>` setup to `<FileRoutes />`.
4. Add `src/entry-server.tsx` / `src/entry-client.tsx` for SSR.

The route structure and component patterns are already compatible with SolidStart conventions — only the plumbing changes.

## Development

```sh
pnpm dev      # Start Vite dev server
pnpm build    # Production build to dist/
pnpm preview  # Preview production build locally
```

## Routes

- `/` — Homepage listing all 17 primitives by category
- `/primitives/:name` — Dynamic route for each primitive's documentation
- `/performance` — Performance dashboard reading `@solidiom/bench` report data

## Performance Dashboard

The `/performance` route loads benchmark data from `/bench-report.json` (served from `public/`). To generate a report:

```sh
# From workspace root
pnpm --filter @solidiom/bench report
cp bench-report.json apps/docs/public/
```

If no report file exists, the dashboard renders sample data for development.

## Dogfooding

All 17 workspace primitives are listed as `workspace:*` dependencies and consumed in package mode. This ensures the docs app exercises the same build artifacts and export conditions that downstream consumers use.

## Vite Resolve Configuration

### Why `"solid-js/web": "@solidjs/web"` alias

In Solid 1 the DOM runtime was a subpath export: `solid-js/web`. Solid 2 moved it to the standalone package `@solidjs/web`. However, `vite-plugin-solid` (and its underlying `babel-preset-solid`) still emit imports targeting the old `solid-js/web` path internally — for dev-mode `optimizeDeps` pre-bundling and HMR injection. Without the alias, Vite attempts to resolve `solid-js/web` as a Node subpath import, which no longer exists in the `solid-js@2` package structure, causing resolution failures.

The alias in `vite.config.ts` tells Vite: "whenever anything requests `solid-js/web`, resolve it to the `@solidjs/web` package instead." The same logic applies to `solid-js/store` → `solid-js` (stores were folded back into the main `solid-js` package in Solid 2) and the other legacy subpaths.

These aliases can be removed once `vite-plugin-solid` ships a release that natively targets Solid 2's package layout.

### Why `resolve.dedupe`

Workspace packages declare `solid-js` as a peer dependency but not `@solidjs/web`. The docs app consumes these packages via the `"solid"` export condition, which points at raw `.tsx` source files. When Vite compiles that JSX it injects `import` from `@solidjs/web` (per the `moduleName` setting). Under pnpm's strict hoisting, `@solidjs/web` is only installed in the docs app's `node_modules` — it is not resolvable from within a workspace package's directory.

`resolve.dedupe: ["solid-js", "@solidjs/web"]` forces Vite to resolve these packages from a single location (the app root) regardless of which source file triggered the import, preventing the "failed to resolve" build error.
