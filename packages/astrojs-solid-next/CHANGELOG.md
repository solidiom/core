# @solidiom/astrojs-solid-next

## 0.3.0

### Minor Changes

- Beta release 0.3.0

  - Resolved offline smoke-test fixture errors (verdaccio publish conflicts,
    pnpm integrity check failures).
  - Eliminated E2E test hydration-timing flakiness across all browser projects.
  - All CI gates pass: smoke-create-prep, site-e2e, and the full test surface.

- [`2dabc5a`](https://github.com/solidiom/core/commit/2dabc5a8419cbbf51c8d2d7ee45e8cb067ba486a) - Make `@solidiom/astrojs-solid-next` a published package and fix Solid 2
  resolution for npm consumers.

  - Removed `private: true`; the package now ships a compiled `dist/` with
    type declarations (`tsup` + `tsc --emitDeclarationOnly`) instead of raw
    `src/*.ts`.
  - Added a Vite `resolve.alias` (generated at config time) that pins every
    installed `@solidiom/*` primitive to its `solid` export-condition source
    in **all** Vite environments, including Astro's `prerender`.
  - This fixes a silent SSR failure on npm: Astro's prerender environment does
    not apply the `solid` export condition to `node_modules`, so `@solidiom/*`
    primitives resolved to their React-compiled `dist/` build and SSR threw
    `ReferenceError: React is not defined` (swallowed by the renderer, leaving
    an empty `<astro-island>`). pnpm workspaces were unaffected because they
    resolve the `solid` condition automatically.
  - Widened `peerDependencies` from the pinned `2.0.0-beta.32` to
    `>=2.0.0-beta.32 <3.0.0` for `solid-js` / `@solidjs/web`, and added
    `astro` and `vite` as peers.
  - `Options` is now typed structurally (no `vite` type re-exports) and the
    plugin list is narrowed to a minimal structural shape, avoiding a
    TypeScript 6.0.3 declaration-emit internal error.
