# @solidiom/cli

## 0.1.0

### Minor Changes

- [`e0d330e`](https://github.com/solidiom/core/commit/e0d330e847cb2ef5127239a47c77ddd117de6927) Thanks [@devx](https://github.com/devx)! - Add a `tanstack-start-solid` SSR template for `solidiom create` (CLI-007 PR2).

  The plan named SolidStart as the SSR template pending a compatibility spike against this workspace's `solid-js@2.0.0-beta.24` pin. That spike ran and failed: SolidStart's latest release candidate still nests its own private `solid-js@1.9.14` internally rather than using Solid 2, and a minimal build against it fails immediately (`@solidjs/start/config` does not export `defineConfig` at that release). Per the plan's own pre-agreed fallback, TanStack Start (Solid) was spiked instead and confirmed working: `@tanstack/solid-start@2.0.0-beta.29`'s peer dependencies explicitly target `solid-js: ">=2.0.0-0 <3.0.0"`, a real install against this workspace's exact pins resolves with only peer-dependency warnings (no hard failures, no nested Solid fork), and a minimal fixture builds successfully for both client and SSR targets.

  `templates/tanstack-start-solid/` ships under `templates/` as a real workspace project (same pattern as `vite-solid-router`), selectable via `solidiom create --template tanstack-start-solid`. It demonstrates server-side rendering with a root route, an index and about route, and the same Tailwind-styled `@solidiom/button` demo as the client-only template, for a comparable side-by-side.

  Every `@tanstack/*` dependency is exact-pinned rather than range-pinned. The plan's own security note about a May 2026 npm compromise affecting this package turned out to describe two separate incidents; the version pinned here postdates both by roughly two months and is not in either affected range, but exact-pinning and routing installs through the existing verification path (CLI-003) apply regardless.

  `src/create/materialize.ts` gained one fix needed to support this template: `routeTree.gen.ts` (TanStack Router's own generated route-registration file, rewritten on every `dev`/`build` and explicitly marked "will be overwritten") is now excluded from template copying, so a scaffolded project always gets its own freshly generated route tree instead of a stale one copied from the template's workspace checkout.

- [`d51c79d`](https://github.com/solidiom/core/commit/d51c79dd910d9558bee3cdf181932cfdd1c2902e) Thanks [@devx](https://github.com/devx)! - Add byte-level verified source installs, component/block/theme install destinations with conflict detection and rollback, and a `solidiom create` command with a template materialization engine (CLI-003, CLI-004, CLI-006, CLI-007 PR1).

  **Verified source installs (CLI-003, in-repo portion).** `solidiom add --mode source` now hashes the actual bytes of every file it is about to write against the registry manifest's `integrity.fileDigests` before writing anything. `verifyRegistry()` already recomputed `filesHash` from the manifest's own recorded digests, but never checked those digests against real file content — a tampered or corrupted source tree could still pass. The new `verifySourceIntegrity()` closes that gap. A failed verification now writes nothing; `--allow-unverified` proceeds anyway and records `provenance: "unverified"` on every affected lock entry, surfaced by `inspect provenance <primitive>` and a new `doctor` warning.

  `LockEntry` (`.solidiom/lock.json`) gains required fields: `manifestFilesHash`, `verifiedAt`, `provenance: "verified" | "unverified"`, and optional `signatureKeyId`. The lock format stays `version: 1` — there is no migration path and no dual reader for pre-existing lock files without these fields; regenerate local locks via a fresh install.

  **Not included:** CI signing-key provisioning, a signed `registry/index.json`, and a CI assertion against unverified lock entries remain blocked on OPS-002 and are not part of this change.

  **Component/block/theme install flow (CLI-004).** `ConfigSchema` gains `componentDir` (default `src/ui/components`), `blockDir` (default `src/ui/blocks`), `themeDir` (default `src/ui/themes`), and an optional `stylingProfile`. Source installs now write to the directory matching the plan's deliverable kind instead of always writing under `sourceDir`. Before any write, planned files are classified against the lockfile and on-disk state (`create` / `unchanged` / `modified-by-user` / `overwrite`); a file the user has edited since install blocks the install by default, with a rendered diff and a remediation hint. `add` gains `--force` (overwrite anyway) and `--diff` (show what would change without writing). A rollback journal wraps every write so any mid-install failure — forced or not — leaves the tree byte-identical to before the attempt. Theme installs are modeled per styling profile: CSS/Tailwind copy a stylesheet; UnoCSS has no consumer codemod yet, so that path returns clear manual-wiring instructions rather than editing a consumer's preset config.

  **`solidiom create` (CLI-006 skeleton + CLI-007 PR1 engine).** New `create <name> --template <name>` command: validates the destination (refuses path traversal out of `cwd`, the home directory, `/`, and the monorepo root; refuses a non-empty existing directory without `--force`), validates the project name against npm naming rules, supports `--yes` for fully non-interactive use (missing required flags fail explicitly rather than defaulting silently), and prompts via `@clack/prompts` for anything not supplied by flags. Ctrl-C and prompt cancellation both clean up only the directories this invocation created.

  Template materialization (`src/create/materialize.ts`) copies a template's files with `{{var}}` substitution against an explicit allowlist, rewrites `workspace:*` dependency specifiers to real versions when a monorepo is present (and degrades gracefully — leaving the specifier as-is with a warning — when it isn't), strips repo-local `tsconfig` references, and refuses to copy a template payload that contains a lockfile. `src/create/config-gen.ts` writes `.solidiom/config.json` so a freshly scaffolded project is immediately usable with `solidiom add`. Dependency installation, when requested, runs through the existing package-manager execution boundary (`execFile` with an argv array, never a shell string).

  A first template, `vite-solid-router` (client-only Vite + Solid Router), ships under `templates/` as a real workspace project with its own `typecheck`/`build` targets, per the "templates are real workspace projects" design decision. A SolidStart-based SSR template is planned separately and is not part of this change.

### Patch Changes

- [`bd4cc5f`](https://github.com/solidiom/core/commit/bd4cc5fdf748bcdd0b1c84f76171a775348cf463) Thanks [@devx](https://github.com/devx)! - `solidiom create` now emits dependency overrides into the generated project's `package.json`, so every package manager resolves a single version of the pinned Solid packages (CLI-008).

  Rewriting `catalog:` and `workspace:*` on a template's direct dependencies was only half of what a standalone project needs. Inside this monorepo, `pnpm-workspace.yaml`'s `overrides:` map is what actually guarantees one resolved `solid-js` across the whole tree. A materialized project has no workspace file, so nothing constrained its **transitive** graph: every package peer-depending on `solid-js`/`@solidjs/web` was free to pull its own range.

  Two consequences, both observed while building CLI-008's offline smoke matrix:

  - A duplicated Solid reactive runtime — two copies of the reactive graph in one app, which breaks silently rather than loudly.
  - Under npm, a resolver backtrack across the entire Solid 2 prerelease space. Installing the `tanstack-start-solid` template exceeded a five-minute timeout; with overrides emitted it completes in under four seconds.

  `materialize()` now fills in `overrides` (read by npm and bun), `resolutions` (yarn and bun), and `pnpm.overrides` (pnpm) from the same `overrides:` map it already consults for `catalog:` resolution. Each manager ignores the fields it does not recognize. Entries a template declares itself always win, so a template can still deliberately pin something different; only gaps are filled.

  Unchanged behavior worth noting: the source of truth is the monorepo's `pnpm-workspace.yaml`, the same limit that already applies to `workspace:*` rewriting. Running from a published CLI with no checkout present, there is no overrides map to read and none is emitted.
