---
"@solidiom/runtime": patch
"@solidiom/primitives": patch
"@solidiom/astrojs-solid-next": patch
---

Bump the Solid 2 rolling prerelease window to `2.0.0-rc.7` (latest on npm, published 2026-09-09).

- `solid-js` and `@solidjs/web` pinned to `2.0.0-rc.7` (was `2.0.0-rc.1`).
- `babel-preset-solid` stays pinned to `2.0.0-rc.2` — the compiler version line lags the runtime.
- `@solidjs/testing-library` bumped to `1.0.0-beta.3`.
- `@solidjs/router` in the templates stays at `0.17.0-next.6`, the newest 0.x prerelease compatible with Solid 2; Router `2.0.0-next.23` removes the templates' `Router`, `Route`, and `A` APIs and requires a separate routing-architecture migration.

The workspace dependency graph and Solid compatibility window were refreshed together and validated against the repository's build, typecheck, and test gates.
