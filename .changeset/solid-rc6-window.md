---
"@solidiom/runtime": patch
"@solidiom/primitives": patch
"@solidiom/astrojs-solid-next": patch
---

Bump the Solid 2 rolling prerelease window to `2.0.0-rc.6` (latest on npm, published 2026-09-02).

- `solid-js` and `@solidjs/web` pinned to `2.0.0-rc.6` (was `2.0.0-rc.1`).
- `babel-preset-solid` pinned to `2.0.0-rc.2` — the compiler lags the runtime; `rc.6` does not exist for it.
- `@solidjs/testing-library` bumped to `1.0.0-beta.3`.
- `@solidjs/router` (templates) stays at `0.17.0-next.6`; its peer range already accepts `rc.6` and it now resolves its peer against `rc.6`.

The Solid 2 `rc.1` → `rc.6` gap is prerelease patch-level changes (no breaking API). Verified green across the monorepo: build (140/140), typecheck (109 projects, 0 errors), lint (0), and tests (108/108 projects).
