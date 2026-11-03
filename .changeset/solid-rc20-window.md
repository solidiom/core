---
"@solidiom/runtime": patch
---

Advance the Solid 2 rolling window to the `2.0.0-rc.20` high tier: `{ low: 2.0.0-rc.16, mid: 2.0.0-rc.18, high: 2.0.0-rc.20 }`, installed toolchain pinned to `2.0.0-rc.20` (solid-js, @solidjs/web). `babel-preset-solid` stays at `2.0.0-rc.2` — its release line is version-decoupled from the runtime and lags it. The peer floor moves to `>=2.0.0-rc.16 <3.0.0`: the rc.8 low tier was tested and fails on rc.9+ runtime internals (`@solidjs/web` gained the `./performance-tracks` export consumed by the recipe-parity suite; the dev-mode `setConsoleFooter` binding used by `@solidjs/testing-library@1.0.0-beta.3` predates rc.9), so rc.16 is the lowest tier with evidence. The prerelease peer range is now generated as an explicit `>=floor <major` range instead of `^floor`, which under npm semver would never match the stable `2.0.0` release.

Toolchain repairs that make the compat matrix real:

- `scripts/set-solid-version.mjs` no longer forces `babel-preset-solid` to the tier version (releases above rc.2 do not exist, and pnpm silently ignores overrides that match nothing, so every nightly tier was silently testing the pinned toolchain). The compiler pin now comes from the matrix `compiler` field, and every resolved version is verified against the npm registry before being written — a nonexistent override target now fails the build loudly.
- `tools/solid-matrix.json` gains the `compiler` field separating the runtime window from the compiler pin.
- `scripts/update-solid-window.mts` keeps the compiler pin, verifies the new version exists on npm, generates a prerelease-aware peer range, and rewrites only inside the `catalog:`/`overrides:` blocks with a key-regex that handles both bare and quoted YAML keys (the old positional regex silently skipped unquoted keys).
- Every package `test` script now points at the shared root vitest config, so the node lanes actually apply the browser-test exclusion (previously ~100 lanes ran vitest with its own defaults and relied on a nonexistent per-package config; the exclusion only worked when the suite happened to run from the repo root).
- `packages/file-input` drops a stale double-cast that Solid rc.20's stricter `JSX.HTMLAttributes` index signature rejects.
