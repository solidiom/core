---
"@solidiom/cli": patch
---

`solidiom create` now emits dependency overrides into the generated project's `package.json`, so every package manager resolves a single version of the pinned Solid packages (CLI-008).

Rewriting `catalog:` and `workspace:*` on a template's direct dependencies was only half of what a standalone project needs. Inside this monorepo, `pnpm-workspace.yaml`'s `overrides:` map is what actually guarantees one resolved `solid-js` across the whole tree. A materialized project has no workspace file, so nothing constrained its **transitive** graph: every package peer-depending on `solid-js`/`@solidjs/web` was free to pull its own range.

Two consequences, both observed while building CLI-008's offline smoke matrix:

- A duplicated Solid reactive runtime — two copies of the reactive graph in one app, which breaks silently rather than loudly.
- Under npm, a resolver backtrack across the entire Solid 2 prerelease space. Installing the `tanstack-start-solid` template exceeded a five-minute timeout; with overrides emitted it completes in under four seconds.

`materialize()` now fills in `overrides` (read by npm and bun), `resolutions` (yarn and bun), and `pnpm.overrides` (pnpm) from the same `overrides:` map it already consults for `catalog:` resolution. Each manager ignores the fields it does not recognize. Entries a template declares itself always win, so a template can still deliberately pin something different; only gaps are filled.

Unchanged behavior worth noting: the source of truth is the monorepo's `pnpm-workspace.yaml`, the same limit that already applies to `workspace:*` rewriting. Running from a published CLI with no checkout present, there is no overrides map to read and none is emitted.
