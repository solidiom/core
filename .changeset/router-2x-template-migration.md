---
"@solidiom/template-vite-solid-router": patch
---

Migrate all 30 Solid Router templates to `@solidjs/router@2.0.0-next.43` (the 2.x config-API rewrite; peers solid-js `^2.0.0-rc.19`, satisfied by the rc.20 window):

- `<Router root={X}><Route .../></Router>` → `createRouter({ routes: defineRoutes([...]) })` with the root as the render-prop child (the official 0.x→2.x mapping).
- `<A>` removed upstream: all links become plain `<a>` (the router claims anchors automatically); the one `end`-match usage (`vite-solid-router` App) moves to `useLinkState().current()`.
- 29 template `tsconfig.json` files had a stale `jsxImportSource: "solid-js"` that broke `tsc` against the Solid 2 line (no `solid-js/jsx-runtime` export); corrected to `@solidjs/web`, matching the base config and the two templates that already typechecked.
- Router 2.x runtime smoke test (memory-history render) passed in a sandbox; all 30 templates verified with `tsc` + `vite build` against published `@solidiom/*@0.6.0`.

Pre-existing template typecheck debt (unrelated to routing: published 0.6.0 component props lagging template usage, missing CSS module declarations) remains — templates are excluded from the CI typecheck lane and gated by `pnpm --filter '@solidiom/template-*' build`, which passes 31/31.
