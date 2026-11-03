---
"@solidiom/runtime": patch
---

Companion-pin refresh after the rc.20 window bump, plus the Solid 2 GA transition tooling (Task 69):

- `@solidjs/testing-library` moves `^1.0.0-beta.3` → `^1.0.0-rc.2` (registry `next` tag; peers `>=2.0.0-0`). Node and browser suites green on rc.2.
- `vite-plugin-solid` stays at `3.0.0-next.27`: npm's `next` tag is that exact version — no newer 3.0.0-next release exists.
- `@solidjs/router` stays at `0.17.0-next.6` in the 30 templates. The 2.x line (`2.0.0-next.43`) was tested against the real `vite-solid-router` template and is a hard breaking change: the frameworkless rewrite drops the `Router`, `Route`, and `A` exports the templates import. A template migration is a separate task.
- `scripts/solid2-stable-transition.mts` rewritten: it previously clobbered `tools/solid-matrix.json` (replacing the `window`/`compiler` schema with `{versions, window: "stable"}`, which would break `set-solid-version.mjs` and the nightly tier matrix on GA day), missed `@solidjs/web`, and rewrote YAML with a global regex. The rewrite keeps the matrix schema (window collapsed to the stable version, compiler resolved from npm — on the stable line the compiler and runtime versions move together again), rewrites catalog/overrides block-scoped, verifies every version against the npm registry before writing anything, refuses prerelease input, and regenerates the lockfile. Verified: dry-run, prerelease rejection, nonexistent-version rejection, and a full write path against a stubbed registry.
