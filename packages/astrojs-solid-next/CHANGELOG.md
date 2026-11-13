# @solidiom/astrojs-solid-next

## 0.7.0

### Minor Changes

- [`729f66d`](https://github.com/solidiom/core/commit/729f66d38adbb6f044ebcaae406fe129dc414a86) Thanks [@devx](https://github.com/devx)! - Release 0.7.0. Coordinated workspace-wide minor bump: all 103 published `@solidiom/*` packages advance from `0.6.0` to `0.7.0` in lockstep.

  - **Solid 2 rolling window advanced to the `2.0.0-rc.21` tier.** The compat matrix moved through rc.20 to `{ low: 2.0.0-rc.18, mid: 2.0.0-rc.20, high: 2.0.0-rc.21 }`, with the installed toolchain pinned to `2.0.0-rc.21` (solid-js, @solidjs/web; @solidjs/signals follows transitively). The peer floor moves to `>=2.0.0-rc.18 <3.0.0`; rc.16 remains the lowest tier ever verified green, so nothing previously supported is dropped below the tested floor. `babel-preset-solid` stays at `2.0.0-rc.2` - its release line is version-decoupled from the runtime.
  - **Companion-pin refresh.** `@solidjs/testing-library` moves to `^1.0.0-rc.2` (registry `next` tag; peers `>=2.0.0-0`); node and browser suites are green on rc.2.
  - **Solid 2 GA transition tooling.** `scripts/solid2-stable-transition.mts` rewritten: it now keeps the `tools/solid-matrix.json` schema (window collapsed to the stable version, compiler resolved from npm), rewrites catalog/overrides block-scoped, verifies every version against the npm registry before writing anything, refuses prerelease input, and regenerates the lockfile.
  - **All 30 Solid Router templates migrated to `@solidjs/router@2.0.0-next.43`.** The 2.x config-API rewrite replaces `<Router>/<Route>` with `createRouter({ routes: defineRoutes([...]) })` (root as render-prop child), drops `<A>` for plain `<a>` links (`end`-match usage moves to `useLinkState().current()`), and corrects a stale `jsxImportSource: "solid-js"` in 29 template `tsconfig.json` files to `@solidjs/web`. All 30 templates verified with `tsc` + `vite build`.
  - **Toolchain repairs that make the compat matrix real.** `set-solid-version.mjs` no longer forces `babel-preset-solid` to the tier version (no such releases exist; pnpm silently ignored the dead override, so nightly tiers were testing the pinned toolchain); the compiler pin now comes from the matrix `compiler` field and every resolved version is verified against npm before being written. `update-solid-window.mts` keeps the compiler pin, verifies new versions on npm, generates a prerelease-aware peer range, and rewrites only inside `catalog:`/`overrides:` blocks. Every package `test` script now points at the shared root vitest config so the node lanes actually apply the browser-test exclusion.
  - **E2E and CI hardening.** Docs e2e `webServer` made spawnable and port-configurable; webkit coverage restored, dead parity wiring removed, and load flakes fixed. Site Astro sources reformatted under prettier-plugin-astro 1.1.0.

## 0.6.0

### Minor Changes

- Release all publishable workspace packages as 0.6.0.

## 0.5.0

### Minor Changes

- [`7253b42`](https://github.com/solidiom/core/commit/7253b42359b80003b82d70ccb383193461c1b9f2) Thanks [@devx](https://github.com/devx)! - This is the workspace-wide 0.5.0 release.

## 0.4.2

### Patch Changes

- [`04f0829`](https://github.com/solidiom/core/commit/04f0829e58575e7462dd236f0959f2246db604c0) - Bump the Solid 2 rolling prerelease window to `2.0.0-rc.7` (latest on npm, published 2026-09-09).

  - `solid-js` and `@solidjs/web` pinned to `2.0.0-rc.7` (was `2.0.0-rc.1`).
  - `babel-preset-solid` stays pinned to `2.0.0-rc.2` — the compiler version line lags the runtime.
  - `@solidjs/testing-library` bumped to `1.0.0-beta.3`.
  - `@solidjs/router` in the templates stays at `0.17.0-next.6`, the newest 0.x prerelease compatible with Solid 2; Router `2.0.0-next.23` removes the templates' `Router`, `Route`, and `A` APIs and requires a separate routing-architecture migration.

  The workspace dependency graph and Solid compatibility window were refreshed together and validated against the repository's build, typecheck, and test gates.

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
