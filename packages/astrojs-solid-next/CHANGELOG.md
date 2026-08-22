# @solidiom/astrojs-solid-next

## 0.4.1

### Patch Changes

- Correct the published Solid peer dependency ranges. All packages now declare `solid-js`, `@solidjs/web`, and `babel-preset-solid` via the shared pnpm catalog, locked to `>=2.0.0-rc.1 <3.0.0`.

  Previously some 0.4.0 packages advertised a `>=2.0.0-beta` peer range (or the catalog resolved to a beta) even though they were built and tested against the Solid 2 RC. Consumers now receive a peer range that matches the version these packages are actually built against.

## 0.4.0

### Minor Changes

- Beta release 0.4.0. Coordinated workspace-wide minor bump.

  - **Solid 2 support window advanced to `2.0.0-rc.1`.** `solid-js` and
    `@solidjs/web` are pinned to `2.0.0-rc.1` (previously `2.0.0-rc.0`) across the
    root dev dependencies, workspace overrides, and templates. The rolling Solid
    window (`tools/solid-matrix.json`) advances to
    `{ low: 2.0.0-beta.34, mid: 2.0.0-rc.0, high: 2.0.0-rc.1 }` with peer range
    `^2.0.0-beta.34`.
  - **`@solidiom/adapter-table-tanstack`** is rewritten against
    `@tanstack/table-core` v9's feature-modular API (`tableFeatures` +
    `constructTable` with `createCoreRowModel` / `createSortedRowModel` /
    `createFilteredRowModel`), replacing the v8 `createTable` / `getCoreRowModel`
    shape. The public capability surface (`createTanStackTableAdapter` and the
    `TableModelCapability` interfaces) is unchanged; consumers now resolve
    `@tanstack/table-core@9`.
  - **`@solidiom/cli`** resolves registry package versions as caret ranges
    (e.g. `^0.4.0`) instead of exact pins when planning installs, so consumers
    pick up in-range single-package releases without a registry regeneration.
    Pre-release versions and dist-tags are left unchanged. Also bumps `zod` to v4
    (`z.record` now takes an explicit key schema) and `ts-morph` to v28 with no
    change to CLI behavior or output.
  - **Dependency refresh** across adapters:
    `@solidiom/adapter-virtualization-tanstack` bumps `@tanstack/virtual-core` to
    3.17.8, and `@solidiom/adapter-date-internationalized` bumps
    `@internationalized/date` to `^3.12.3`. All packages refreshed to their latest
    compatible releases (TypeScript kept on the 6.x line).
  - **Release tooling** hardened: fail-fast Cloudflare token pre-flight with setup
    guidance that probes the Pages API instead of `/tokens/verify`, and a script
    to unpublish versions.
  - **Site & branding:** quadrant mark applied across brand assets and site
    chrome, footer community links point to on-site pages, and top-nav / language
    switcher spacing fixes.
  - **Documentation** synchronized with the current implementation, and an
    AI-assisted contributions policy added.

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
