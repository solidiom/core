# @solidiom/textarea

## 0.7.0

### Minor Changes

- [`729f66d`](https://github.com/solidiom/core/commit/729f66d38adbb6f044ebcaae406fe129dc414a86) Thanks [@devx](https://github.com/devx)! - Release 0.7.0. Coordinated workspace-wide minor bump: all 103 published `@solidiom/*` packages advance from `0.6.0` to `0.7.0` in lockstep.

  - **Solid 2 rolling window advanced to the `2.0.0-rc.21` tier.** The compat matrix moved through rc.20 to `{ low: 2.0.0-rc.18, mid: 2.0.0-rc.20, high: 2.0.0-rc.21 }`, with the installed toolchain pinned to `2.0.0-rc.21` (solid-js, @solidjs/web; @solidjs/signals follows transitively). The peer floor moves to `>=2.0.0-rc.18 <3.0.0`; rc.16 remains the lowest tier ever verified green, so nothing previously supported is dropped below the tested floor. `babel-preset-solid` stays at `2.0.0-rc.2` - its release line is version-decoupled from the runtime.
  - **Companion-pin refresh.** `@solidjs/testing-library` moves to `^1.0.0-rc.2` (registry `next` tag; peers `>=2.0.0-0`); node and browser suites are green on rc.2.
  - **Solid 2 GA transition tooling.** `scripts/solid2-stable-transition.mts` rewritten: it now keeps the `tools/solid-matrix.json` schema (window collapsed to the stable version, compiler resolved from npm), rewrites catalog/overrides block-scoped, verifies every version against the npm registry before writing anything, refuses prerelease input, and regenerates the lockfile.
  - **All 30 Solid Router templates migrated to `@solidjs/router@2.0.0-next.43`.** The 2.x config-API rewrite replaces `<Router>/<Route>` with `createRouter({ routes: defineRoutes([...]) })` (root as render-prop child), drops `<A>` for plain `<a>` links (`end`-match usage moves to `useLinkState().current()`), and corrects a stale `jsxImportSource: "solid-js"` in 29 template `tsconfig.json` files to `@solidjs/web`. All 30 templates verified with `tsc` + `vite build`.
  - **Toolchain repairs that make the compat matrix real.** `set-solid-version.mjs` no longer forces `babel-preset-solid` to the tier version (no such releases exist; pnpm silently ignored the dead override, so nightly tiers were testing the pinned toolchain); the compiler pin now comes from the matrix `compiler` field and every resolved version is verified against npm before being written. `update-solid-window.mts` keeps the compiler pin, verifies new versions on npm, generates a prerelease-aware peer range, and rewrites only inside `catalog:`/`overrides:` blocks. Every package `test` script now points at the shared root vitest config so the node lanes actually apply the browser-test exclusion.
  - **E2E and CI hardening.** Docs e2e `webServer` made spawnable and port-configurable; webkit coverage restored, dead parity wiring removed, and load flakes fixed. Site Astro sources reformatted under prettier-plugin-astro 1.1.0.

### Patch Changes

- Updated dependencies [[`729f66d`](https://github.com/solidiom/core/commit/729f66d38adbb6f044ebcaae406fe129dc414a86)]:
  - @solidiom/runtime@0.7.0

## 0.6.0

### Minor Changes

- Release all publishable workspace packages as 0.6.0.

### Patch Changes

- Updated dependencies []:
  - @solidiom/runtime@0.6.0

## 0.5.0

### Minor Changes

- [`7253b42`](https://github.com/solidiom/core/commit/7253b42359b80003b82d70ccb383193461c1b9f2) Thanks [@devx](https://github.com/devx)! - This is the workspace-wide 0.5.0 release.

### Patch Changes

- Updated dependencies [[`7253b42`](https://github.com/solidiom/core/commit/7253b42359b80003b82d70ccb383193461c1b9f2)]:
  - @solidiom/runtime@0.5.0

## 0.4.2

### Patch Changes

- Initial release of the standalone textarea primitive.
