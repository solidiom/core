---
"@solidiom/runtime": patch
---

Advance the Solid 2 rolling window to the `2.0.0-rc.21` high tier: `{ low: 2.0.0-rc.18, mid: 2.0.0-rc.20, high: 2.0.0-rc.21 }`, installed toolchain pinned to `2.0.0-rc.21` (solid-js, @solidjs/web; `@solidjs/signals` follows transitively at `2.0.0-rc.21`). Applied via `scripts/update-solid-window.mts 2.0.0-rc.21`, which keeps the compiler pin, verifies the new versions against the npm registry, and rewrites the matrix, catalog, overrides and root devDependencies together.

`babel-preset-solid` stays at `2.0.0-rc.2` — its release line is version-decoupled from the runtime and npm's `next` tag is still that exact version, so there is no newer compiler release to move to. The peer floor moves to `>=2.0.0-rc.18 <3.0.0`: the floor tracks the window low tier, and rc.16 remains the lowest tier ever verified green (build + node + browser), so nothing previously supported is dropped below the tested floor.

No source changes were required: rc.21 is consumed through the same public API surface as rc.20.
