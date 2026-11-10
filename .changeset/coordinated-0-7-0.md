---
"@solidiom/accordion": minor
"@solidiom/adapter-carousel-embla": minor
"@solidiom/adapter-date-internationalized": minor
"@solidiom/adapter-positioning-floating-ui": minor
"@solidiom/adapter-positioning-minimal": minor
"@solidiom/adapter-table-tanstack": minor
"@solidiom/adapter-virtualization-tanstack": minor
"@solidiom/alert": minor
"@solidiom/alert-dialog": minor
"@solidiom/app-shell": minor
"@solidiom/aspect-ratio": minor
"@solidiom/astrojs-solid-next": minor
"@solidiom/attachment": minor
"@solidiom/avatar": minor
"@solidiom/avatar-group": minor
"@solidiom/badge": minor
"@solidiom/banner": minor
"@solidiom/breadcrumb": minor
"@solidiom/button": minor
"@solidiom/calendar": minor
"@solidiom/card": minor
"@solidiom/carousel": minor
"@solidiom/chart": minor
"@solidiom/chat-composer": minor
"@solidiom/chat-layout": minor
"@solidiom/chat-message": minor
"@solidiom/chat-message-metadata": minor
"@solidiom/chat-system-message": minor
"@solidiom/chat-tool-calls": minor
"@solidiom/checkbox": minor
"@solidiom/cli": minor
"@solidiom/code-block": minor
"@solidiom/collapsible": minor
"@solidiom/combobox": minor
"@solidiom/command-palette": minor
"@solidiom/context-menu": minor
"@solidiom/data-table": minor
"@solidiom/date-picker": minor
"@solidiom/date-range-input": minor
"@solidiom/dialog": minor
"@solidiom/direction": minor
"@solidiom/drawer": minor
"@solidiom/empty-state": minor
"@solidiom/field": minor
"@solidiom/file-input": minor
"@solidiom/grid": minor
"@solidiom/hover-card": minor
"@solidiom/input": minor
"@solidiom/input-group": minor
"@solidiom/input-otp": minor
"@solidiom/kbd": minor
"@solidiom/label": minor
"@solidiom/lightbox": minor
"@solidiom/link": minor
"@solidiom/listbox": minor
"@solidiom/mega-menu": minor
"@solidiom/menu": minor
"@solidiom/menubar": minor
"@solidiom/message-scroller": minor
"@solidiom/meter": minor
"@solidiom/multi-selector": minor
"@solidiom/navigation-menu": minor
"@solidiom/number-input": minor
"@solidiom/pagination": minor
"@solidiom/popover": minor
"@solidiom/primitives": minor
"@solidiom/progress": minor
"@solidiom/questionnaire": minor
"@solidiom/radio-group": minor
"@solidiom/recipes-css": minor
"@solidiom/recipes-tailwind": minor
"@solidiom/recipes-unocss": minor
"@solidiom/resizable-panels": minor
"@solidiom/runtime": minor
"@solidiom/scroll-area": minor
"@solidiom/segmented-control": minor
"@solidiom/select": minor
"@solidiom/separator": minor
"@solidiom/sheet": minor
"@solidiom/sidebar": minor
"@solidiom/skeleton": minor
"@solidiom/slider": minor
"@solidiom/spinner": minor
"@solidiom/stack": minor
"@solidiom/status-dot": minor
"@solidiom/switch": minor
"@solidiom/table": minor
"@solidiom/tabs": minor
"@solidiom/textarea": minor
"@solidiom/themes": minor
"@solidiom/time-input": minor
"@solidiom/toast": minor
"@solidiom/toggle": minor
"@solidiom/toggle-group": minor
"@solidiom/tokenizer": minor
"@solidiom/toolbar": minor
"@solidiom/tooltip": minor
"@solidiom/tree": minor
"@solidiom/typography": minor
"@solidiom/unocss-preset": minor
"@solidiom/virtual-list": minor
"@solidiom/visually-hidden": minor
"@solidiom/vite-plugin": minor
---

Release 0.7.0. Coordinated workspace-wide minor bump: all 103 published `@solidiom/*` packages advance from `0.6.0` to `0.7.0` in lockstep.

- **Solid 2 rolling window advanced to the `2.0.0-rc.21` tier.** The compat matrix moved through rc.20 to `{ low: 2.0.0-rc.18, mid: 2.0.0-rc.20, high: 2.0.0-rc.21 }`, with the installed toolchain pinned to `2.0.0-rc.21` (solid-js, @solidjs/web; @solidjs/signals follows transitively). The peer floor moves to `>=2.0.0-rc.18 <3.0.0`; rc.16 remains the lowest tier ever verified green, so nothing previously supported is dropped below the tested floor. `babel-preset-solid` stays at `2.0.0-rc.2` - its release line is version-decoupled from the runtime.
- **Companion-pin refresh.** `@solidjs/testing-library` moves to `^1.0.0-rc.2` (registry `next` tag; peers `>=2.0.0-0`); node and browser suites are green on rc.2.
- **Solid 2 GA transition tooling.** `scripts/solid2-stable-transition.mts` rewritten: it now keeps the `tools/solid-matrix.json` schema (window collapsed to the stable version, compiler resolved from npm), rewrites catalog/overrides block-scoped, verifies every version against the npm registry before writing anything, refuses prerelease input, and regenerates the lockfile.
- **All 30 Solid Router templates migrated to `@solidjs/router@2.0.0-next.43`.** The 2.x config-API rewrite replaces `<Router>/<Route>` with `createRouter({ routes: defineRoutes([...]) })` (root as render-prop child), drops `<A>` for plain `<a>` links (`end`-match usage moves to `useLinkState().current()`), and corrects a stale `jsxImportSource: "solid-js"` in 29 template `tsconfig.json` files to `@solidjs/web`. All 30 templates verified with `tsc` + `vite build`.
- **Toolchain repairs that make the compat matrix real.** `set-solid-version.mjs` no longer forces `babel-preset-solid` to the tier version (no such releases exist; pnpm silently ignored the dead override, so nightly tiers were testing the pinned toolchain); the compiler pin now comes from the matrix `compiler` field and every resolved version is verified against npm before being written. `update-solid-window.mts` keeps the compiler pin, verifies new versions on npm, generates a prerelease-aware peer range, and rewrites only inside `catalog:`/`overrides:` blocks. Every package `test` script now points at the shared root vitest config so the node lanes actually apply the browser-test exclusion.
- **E2E and CI hardening.** Docs e2e `webServer` made spawnable and port-configurable; webkit coverage restored, dead parity wiring removed, and load flakes fixed. Site Astro sources reformatted under prettier-plugin-astro 1.1.0.
