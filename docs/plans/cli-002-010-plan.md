---
id: cli-002-010-plan
title: "Solidiom CLI — Product Layers, Verified Installs, and Project Creation (CLI-002 – CLI-010)"
sidebar_label: CLI 002–010 Plan
description: Implementation plan for website-tasks CLI-002 through CLI-010, covering deliverable-aware plan/inspect/add, verified source installation, package-manager normalization, and solidiom create.
doc_type: reference
audience: "Solidiom project leads, CLI engineers, registry and security reviewers"
tags: [cli, registry, verification, templates, package-managers, M3]
lifecycle: active
date: 2026-07-31
---

> **Purpose:** Decomposes `docs/plans/website-tasks.md` §7.1 tasks `CLI-002` through `CLI-010` into ordered, reviewable work with concrete file paths, closed design decisions, and per-task acceptance criteria. The task backlog remains the authority for scope; this document controls how the CLI work is built and in what order.

**Status:** CLI-002 and CLI-005 implemented and verified; CLI-003/004/006-010 not started
**Source backlog:** `docs/plans/website-tasks.md` §7.1
**Milestone:** M3 — Public beta platform (gate G3)
**Target package:** `packages/cli` (`@solidiom/cli`)
**Prerequisites:** `REG-003`, `REG-006`, `CLI-001`, `RECIPE-002..004`, `THEME-001..005` — all complete

---

## 1. Scope

Nine tasks in two parallel tracks that converge on documentation and test coverage.

| Task    | Size | Depends on               | Summary                                                         |
| ------- | ---- | ------------------------ | --------------------------------------------------------------- |
| CLI-002 | M    | REG-003, CLI-001         | Deliverable- and styling-aware `plan`, `inspect`, `add`         |
| CLI-003 | M    | REG-006, CLI-002         | Verified manifests/hashes gate source installs; lock provenance |
| CLI-004 | M    | CLI-002, RECIPE-002..004 | Component/block/theme install with conflict, diff, rollback     |
| CLI-005 | M    | CLI-001                  | Package-manager detection and normalized exec                   |
| CLI-006 | M    | CLI-005                  | `solidiom create --template` skeleton and safety                |
| CLI-007 | L    | CLI-006, REG-003         | Template materialization and config generation                  |
| CLI-008 | M    | CLI-007                  | Offline fixtures and four-manager smoke harness                 |
| CLI-009 | S    | CLI-002..008             | Bilingual CLI documentation                                     |
| CLI-010 | M    | CLI-002..008             | Command, AST, tamper, and parity test coverage                  |

Out of scope: the 29 templates (`TPL-000`+, M4), block composition inside templates (`BLOCK-000`, M4), and the theme-builder (`BUILDER-001..006`).

---

## 2. Verified starting state

Facts confirmed by reading the tree on 2026-07-31. These are the constraints the plan is built against.

**Package layout.** `packages/cli/src/` (18 files) is the canonical tree, mirrored byte-for-byte into `source/` (excluding `*.test.ts`) by the `onSuccess` hook in `tools/build/tsup.config.base.ts`. Regenerate with `pnpm run source:emit`; verify with `pnpm run source:emit:check` and `pnpm run audit:package-source-parity`. `tools/audit-package-source-parity.ts` lists `cli` in `TOOLING_PACKAGES` (parity only, no export-map audit).

**Command framework.** clipanion `4.0.0-rc.4`. `src/bin.ts` builds a `Cli` and registers ten commands: init, plan, add, inspect, diff, detach, update, doctor, verify, audit. Every command is a pure `runX(options)` core exported from `src/index.ts` plus a thin `class XCommand extends Command` wrapper. New commands must follow this split.

**`plan` discards registry detail.** `loadRegistry` in `src/commands/plan.ts` reduces each v2 index summary to `{name, deps: ["@solidiom/runtime"], adapters: [], version}`. `deliverables`, `stylingOutputs`, `themeCompatible`, and real `capabilities` are all dropped. `PlanEntry` is `{package, version, isAdapter, reason}` — no deliverable kind, no styling profile.

**The manifest reader silently strips fields.** `registryManifestSchema` in `src/registry-schema.ts` omits `deliverables`, `styling`, `documentation`, `search`, `provenance`, `capabilities`, `runtime`, and `cli` even though `tools/registry-build.ts` emits all of them; zod removes them without error. `registryPrimitiveSummarySchema` already models the index summary in full.

**`deliverables` has two shapes.** `PrimitiveManifestV2.deliverables` is an object (`{primitive: true, component?: boolean, …}`); `IndexManifestV2.primitives[].deliverables` is `string[]`. Resolved by Decision 3.

**Source install is unverified and destructive.** `installSource` in `src/source-install/install.ts` copies files with no hash check, overwrites unconditionally, has no rollback, and hardcodes the destination to `config.sourceDir/<primitive>`. `verifyRegistry` in `src/commands/verify.ts` recomputes `filesHash` _from_ `integrity.fileDigests` but never hashes real file bytes — that gap is CLI-003's core work.

**Lock file.** `.solidiom/lock.json` is `{version: 1, installed: Record<path, LockEntry>}` with `LockEntry = {path, digest, primitive, version, detached?}`. No manifest hash, signature record, deliverable kind, or styling profile.

**No package-manager handling exists.** `src/commands/add.ts` ends with the literal string `` `pnpm add ${packages.join(" ")}` ``. The only other signal is a `pnpm-lock.yaml` sniff inside `findWorkspaceRoot` in `src/commands/audit.ts`.

**No template infrastructure exists.** No `templates/` directory and no `create` command. `apps/site/src/content.config.ts` already declares the `templates` collection contract: `stack: "solidstart" | "tanstack-start-solid" | "vite-solid-router"` and `portfolios: ("balanced-product" | "enterprise-platform-governance")[]`.

**Solid version is pinned to 2 beta.** `pnpm-workspace.yaml` sets `overrides: solid-js: "2.0.0-beta.24"` with catalog `^2.0.0-beta.23`; every primitive peer-depends on `solid-js: "catalog:"` and `@solidjs/web: ">=2.0.0-beta"`. `apps/docs` uses `@solidjs/router 0.17.0-next.5`. No Solid 1 anywhere. Any template must build against this.

**Tests.** vitest 4.x via the root `vitest.config.ts` (`packages/**/src/**/*.{test,spec}.ts`, node environment, `packages/*/source/**` excluded); `packages/cli` has no local vitest config. Six test files, ~50 cases: init, plan, registry, verify-registry, source-install, ast-transform. Convention is `mkdtempSync` in `beforeEach`, `rmSync` in `afterEach`, inline fixture builders (`buttonManifest()`, `baseIndex()`), and no fixtures directory. Source-install tests nest cwd two levels deep (`<tmp>/consumer/app`) so `install.ts`'s `../../packages` heuristic stays inside the temp tree.

**Gates.** `tools/phase1-gate.ts` uses a flat `console.log("\n§N …")` + `check(name, boolean, hint)` pattern, §1–§10. §6 asserts `doctor.ts` exists and `runTests("@solidiom/cli", 8)`. §9b runs the parity audit and asserts `src/source-install/install.ts` exists while `src/source/install.ts` does not.

**Known data gap.** No package sets `nx.metadata.registry.deliverables`, so all 52 committed manifests carry `{primitive: true}` and no real component/block/template/theme entry exists to test against.

---

## 3. Closed decisions

### Decision 1 — Registry signing and the strict default

CI signs `registry/index.json` (the committed artifact is unsigned today, and no Sigstore bundles exist). A new `PolicySchema.requireVerifiedSource` defaults to `true`. `solidiom add --mode source --allow-unverified` proceeds after a red warning and records `verified: false` with `provenance: "unverified"` in the lock, so every exception is greppable. CI in this repo asserts zero `provenance: "unverified"` lock entries.

_Rationale:_ strict on the path real consumers take, with exceptions recorded rather than silent. Requires a CI signing key as a repo secret with a documented rotation path — coordinate with OPS-002.

### Decision 2 — Lock file stays `version: 1`

No consumers exist, so there is nothing to migrate from. New fields are added to `LockEntry` as **required**, `version` stays `1`, and there is no dual reader, no `migrateLock`, no `solidiom migrate lock` command, and no `"legacy"` provenance value. Local dev locks are deleted and regenerated.

_Rationale:_ required fields keep Decision 1's CI assertion enforceable. Optional fields would make absence indistinguishable from an unchecked install, reintroducing fail-open-by-omission. Everything ships as v1 at GA.

### Decision 3 — Unify `deliverables` on sorted `Deliverable[]`

`tools/registry-build.ts` changes `PrimitiveManifestV2.deliverables` from the object map to `Deliverable[]`, sorted. The index summary already uses this shape, so no CLI normalization layer is written.

_Rationale:_ one shape everywhere; sorted arrays are trivially deterministic as REG-004 requires; and the `{primitive: true}` literal cannot express the component-only or theme-only entries `COMP-*`/`BLOCK-*` will produce. Cheapest now, while `deliverables` is uniformly `{primitive: true}` across all 52 manifests.

_Blast radius:_ full `pnpm run registry:build` regeneration (52 manifests, `entriesHash`, index), REG-004 fixture/snapshot updates, and an audit of `apps/site` registry readers. Needs a registry-area reviewer.

### Decision 4 — Templates are real workspace projects at `templates/<name>/`

Each template is a genuine Solid project with `typecheck`/`build`/`lint` Nx targets and `private: true`, using `workspace:*` deps. A prepack step copies the tree into the published CLI so there is still one published artifact. `src/create/materialize.ts` rewrites `workspace:*` to real versions and strips repo-local tsconfig paths.

_Rationale:_ templates must not live under `packages/cli/src/` (tsup compiles it, the parity audit mirrors it). Of the alternatives, only real workspace projects get continuous typecheck, lint, and IDE support — decisive at 29 templates in M4, where payload-as-data would rot and surface breakage only in the slow smoke matrix.

_Known limit:_ the in-workspace form is not the materialized form, so in-place typecheck proves less than it appears. CLI-008 remains the real gate.

_To verify before implementing:_ `pnpm-workspace.yaml` globs and the prettier/eslint ignore lists, so a nested template `package.json` is not absorbed unintentionally.

### Decision 5 — CLI-007 ships the engine plus two templates

`vite-solid-router` (client-only) and SolidStart (SSR), split into two stacked PRs with the engine PR as the acceptance boundary. Both compose primitives directly; block composition arrives with `TPL-000`. Both need EN+ES entries in the `templates` content collection per global DoD #5.

_Rationale:_ the engine is the deliverable and the templates prove it generalizes. The axis that breaks config generation is server vs. no server — SSR forces `app.config.ts`, a server entry, and a pre-hydration theme bootstrap that a SPA never exercises. Sharing Solid Router between both templates isolates SSR as the only changing variable. `tanstack-start-solid` is architecturally close to SolidStart, so adding it later is incremental; all three would push CLI-007 to XL, which §1.2 requires be split into a work package first.

_Open risk — see §6:_ SolidStart's stable line is 1.x and its Solid 2 support is still landing, so the SSR template choice is gated on a spike.

---

## 4. Sequencing

```text
Track A   CLI-002 ──────► CLI-003 ──────► CLI-004 ─┐
                                                    ├─► CLI-009 + CLI-010
Track B   CLI-005 ─► CLI-006 ─► CLI-007 ─► CLI-008 ─┘
```

Both tracks start immediately; all their prerequisites are complete. Roughly 5–7 weeks single-track. CLI-007 (L) and CLI-008's four-manager CI are the schedule risks. CLI-009 and CLI-010 may begin against Track A once CLI-004 lands.

---

## 5. Task plan

### CLI-002 — Deliverable and styling awareness in `plan`, `inspect`, `add`

**Status:** `[x]` **Size:** M **Area:** CLI + Registry

Changes:

- `tools/registry-build.ts` — apply Decision 3: `deliverables` becomes a sorted `Deliverable[]` on `PrimitiveManifestV2`. Regenerate the registry.
- `src/registry-schema.ts` — extend `registryManifestSchema` with `deliverables`, `styling.{outputs,themeCompatible}`, `documentation.{status,locales}`, `search.keywords`, `provenance`, `capabilities`, `runtime`, and `cli.{addCommand,installDeps}`. Export `Deliverable` and `StylingProfile` unions for reuse.
- `src/commands/plan.ts` — carry `deliverables`, `stylingOutputs`, `themeCompatible`, and real capabilities/adapters through `loadRegistry` instead of the hardcoded `["@solidiom/runtime"]`. Add `deliverable?` and `styling?` to `PlanOptions`; add `deliverable`, `stylingProfile`, `stylingArtifacts` to `Plan`. Extend the violation loop: unknown deliverable for the entry, styling profile absent from `styling.outputs`, `--deliverable theme` against a non-`themeCompatible` entry.
- `src/commands/plan.ts` — mark `BUILTIN_PRIMITIVES` entries `deliverables: ["primitive"]`, `stylingOutputs: []` so offline-fallback plans cannot claim styling support they have not confirmed.
- `src/commands/inspect.ts` — route `inspect manifest` through `readRegistryManifest`; it currently raw-`JSON.parse`s `../../registry/<name>.json` with no validation, which is a fail-open hole. Surface deliverables, styling, and documentation locales in `inspect explain`.
- `src/commands/add.ts` — add `--deliverable <kind>` and `--styling <css|tailwind|unocss>`, threaded into `runPlan`.
- Add `nx.metadata.registry.deliverables` to `packages/button/package.json` so one real product-layer data point exists end to end (it already ships CSS and Tailwind recipes).

Acceptance:

- `solidiom plan button --deliverable component --styling unocss` fails with a violation naming the missing output; `--styling css` succeeds.
- `inspect manifest` rejects a hand-mangled manifest with `RegistrySchemaError`.
- A round-trip test asserts no field emitted by `registry-build` is silently stripped by the CLI schema.
- `pnpm run registry:build` is deterministic across two runs; REG-004 snapshots updated intentionally.

**Delivered:** all changes above landed as scoped, plus one addition and one correction discovered during implementation.

- Addition: `packages/button/package.json` also gained a `recipes-unocss` entry independent of this work, so button's real `styling.outputs` is `["css", "tailwind", "unocss"]` — a stronger acceptance data point than the plan anticipated (originally css+tailwind only).
- Correction: `index.ts` did not export `readRegistryIndex`/`readRegistryManifest`/`RegistrySchemaError` at all prior to this task, despite them existing since before this session — now exported alongside the new `Deliverable`/`StylingProfile` types and `DELIVERABLES`/`STYLING_PROFILES` consts.
- Test coverage: `registry-schema.test.ts` (7 tests, new), `plan.test.ts` grew 6→14, `add.test.ts` (8 tests, new), `inspect.test.ts` (8 tests, new). All exercise both the `BUILTIN_PRIMITIVES`/offline-fallback path (which must never claim unverified deliverables/styling) and the real registry path (via button).
- Verified: `pnpm run gate:phase1` passes with all 225 checks; `pnpm run registry:build` regenerated all 52 manifests deterministically.

### CLI-003 — Verified manifests and hashes gate source installation

**Status:** `[ ]` **Size:** M **Area:** CLI + Security

Changes:

- `src/source-install/verify-source.ts` (new) — `verifySourceIntegrity({cwd, registryDir, primitive, files})`: resolve the manifest, call `verifyRegistry()` for index-level trust, then hash the **actual bytes** of every resolved source file against `integrity.fileDigests`. Byte-level comparison is the gap `verifyRegistry` leaves open.
- `src/schemas.ts` — add `PolicySchema.requireVerifiedSource` (default `true`) and `PolicySchema.sourceInstallTrustedKeys`.
- `src/source-install/install.ts` — mandatory verification before any write; on failure return `{verified: false, violations}` and write nothing.
- `src/source-install/lock.ts` (new) — extract `readLock`/`writeLock`/`computeDigest` out of `install.ts` so `diff`, `detach`, `update`, `inspect`, and `install` share one reader. Add required `LockEntry` fields: `manifestFilesHash`, `signatureKeyId?`, `verifiedAt`, `provenance: "verified" | "unverified"`. `version` stays `1` (Decision 2).
- `src/commands/add.ts` — `--allow-unverified`, red warning, `provenance: "unverified"` recorded.
- `src/commands/inspect.ts` — `inspect provenance` prints manifest hash, signature key id, and verification timestamp; it prints only lock digests today.
- CI — sign `registry/index.json` in the registry-build workflow; assert zero `provenance: "unverified"` lock entries in this repo.

Acceptance:

- Tamper tests prove refusal on: a mutated source file, a mutated `fileDigests` entry, a missing manifest, an unsigned index under `requireVerifiedSource`, and a wrong signing key.
- `--allow-unverified` installs and is visible in both `doctor` and `inspect provenance`.
- No write occurs on any verification failure (assert the tree is byte-identical).

### CLI-004 — Source-owned component, block, and theme install flow

**Status:** `[ ]` **Size:** M **Area:** CLI

Changes:

- `src/schemas.ts` — `ConfigSchema` gains `componentDir` (default `src/ui/components`), `blockDir` (`src/ui/blocks`), `themeDir` (`src/ui/themes`), and `stylingProfile` (`"css" | "tailwind" | "unocss"`, no default — chosen at `init`).
- `src/source-install/destinations.ts` (new) — map `(deliverable, config)` to a destination root so `install.ts` stops hardcoding `sourceDir/<primitive>`.
- `src/source-install/conflict.ts` (new) — classify each planned write as `create`, `unchanged`, `modified-by-user` (on-disk digest ≠ lock digest), or `overwrite`. Refuse on `modified-by-user` by default; `--force` overwrites; `--diff` prints a unified diff and exits 0 without writing. Reuse the three-way merge machinery in `src/commands/update.ts` rather than adding a second diff implementation.
- `src/source-install/rollback.ts` (new) — journal `{path, previousContent | null}` before writes, applied on any mid-install failure so a partial tree plus a stale lock is impossible.
- Theme installs are multi-artifact. `packages/themes` exports `./css/<slug>.css` and `./tailwind/<slug>.css`, while the UnoCSS path lives in `packages/unocss-preset/src/generated-theme-preflights.ts` consumed by `presetSolidiom({ theme })`. Model this as a per-profile `ThemeInstallPlan` so `--dry-run` states plainly whether it will copy a stylesheet or patch a preset config.

Acceptance:

- Component, block, and theme each install to their configured directory with a verified manifest.
- A user-modified file blocks the install, prints a diff, and gives a remediation hint.
- A forced mid-install failure leaves the tree byte-identical to before.
- `--dry-run` output matches the actual writes exactly.

### CLI-005 — Package-manager detection and normalized execution

**Status:** `[x]` **Size:** M **Area:** CLI

Changes:

- `src/package-manager/detect.ts` (new) — precedence: `--package-manager` flag → `npm_config_user_agent` → nearest project-root lockfile (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`/`bun.lock`) → `packageManager` field → default `npm`. Return `{name, version?, source}` so `doctor` can explain the choice.
- `src/package-manager/commands.ts` (new) — normalize `add`, `addDev`, `install`, `exec`, `run`, `dlx` across the four managers. Encode the yarn major version; v1 and v3+ differ on dev-dependency flags and on `dlx` vs `create`.
- `src/package-manager/exec.ts` (new) — `runPackageManager({pm, argv, cwd, env, dryRun})` via `execFile` with an **argv array, never string interpolation**. This is the injection-safe boundary for anything derived from registry data or user input.
- `src/commands/add.ts` — replace the `pnpm add` literal with `commands.add(pm, packages)`; keep printing by default, add `--install` to execute.
- `src/commands/doctor.ts` — report the detected manager and the detection source.

Acceptance:

- Unit tests cover four managers × six operations, both yarn generations, and every detection precedence rung.
- No code path builds a shell string from a package name.

**Delivered:** all changes above landed as scoped, with the following adjustments.

- `add.ts`'s `runAdd` became **async** (a breaking signature change to a public export) because installing now goes through `runPackageManager`. `AddOptions` gained `packageManager?`/`install?`; `AddResult` gained `installRun?`. `add`'s default behavior (print the command, don't run it) is unchanged — `--install` opts in to actual execution.
- `commands.ts`'s exports are re-exported from `index.ts` with a `PackageManagerCommand` suffix (`addPackageManagerCommand`, `dlxPackageManagerCommand`, etc.) to avoid colliding with the CLI's own `add` command naming at the package-root export surface.
- `detect.ts`'s precedence chain needed an explicit `env` override to unit-test the npm-default path: any `pnpm exec`/`npm run`-invoked test process has `npm_config_user_agent` set by the manager itself, which is correct precedence-step-2 behavior but means "no signal present" cannot be exercised against the ambient environment — tests inject `env: {}`.
- Test coverage: `detect.test.ts` (18 tests, new), `commands.test.ts` (18 tests, new), `exec.test.ts` (6 tests, new — uses `node` as a stand-in binary rather than requiring all four real managers installed side by side; includes an explicit shell-injection-safety test).
- Verified: `pnpm run gate:phase1` passes; full `packages/cli` suite is 12 files / 124 tests (up from 7 files / 54 before CLI-002/005).

### CLI-006 — `solidiom create --template <name>` skeleton

**Status:** `[ ]` **Size:** M **Area:** CLI

Changes:

- `src/commands/create.ts` (new) — `runCreate(options)` plus `CreateCommand`; register in `src/bin.ts`.
- Destination safety: refuse a non-empty directory unless `--force`; refuse paths escaping the resolved cwd; refuse `~`, `/`, and the repo root; validate the project name against npm naming rules.
- Prompts via `@clack/prompts` — already a dependency and currently unused. Non-interactive flags: `--template`, `--name`, `--package-manager`, `--styling`, `--no-install`, `--yes`. `--yes` with a missing required flag fails explicitly; it never silently picks a default.
- Cancellation: `SIGINT` and clack's cancel signal both route to a journal-based cleanup that removes only directories `create` itself made.

Acceptance:

- Non-TTY `create --yes` with full flags runs without prompting.
- Ctrl-C mid-run leaves no partial directory.
- Every refusal path has a test.

### CLI-007 — Template materialization

**Status:** `[ ]` **Size:** L (two stacked PRs) **Area:** CLI + Templates

PR 1 — engine plus `templates/vite-solid-router/` (acceptance boundary):

- `templates/<name>/` per Decision 4, with `template.json` describing stack, substitution variables, and generated config files. `stack` must use the exact enum in `apps/site/src/content.config.ts`.
- `src/create/materialize.ts` (new) — copy plus `{{var}}` substitution against an allowlist of variable names; no template engine. Rewrites `workspace:*` to real versions and strips repo-local tsconfig paths.
- `src/create/config-gen.ts` (new) — package.json, tsconfig, styling config keyed off the chosen profile, and `.solidiom/config.json` so the generated project is immediately `add`-able.
- Add `templates/*` to `pnpm-workspace.yaml`; give each template `typecheck`/`build`/`lint` Nx targets; add the prepack copy into the published CLI plus a runtime resolution helper.
- Foreign-lockfile rule (§8.4): the payload contains no lockfile, and after install only the chosen manager's lockfile exists. Assert in the materializer, not only in tests.
- Dependency install is opt-in via CLI-005's exec helper; failure triggers CLI-006's rollback journal.

PR 2 — SSR template (`templates/solidstart/`), gated on the §6 spike.

Acceptance:

- Each template generates a project that installs, typechecks, builds, and starts under all four managers with only its own lockfile present.
- Each template typechecks in place in the workspace.
- EN+ES entries exist in the `templates` content collection.

### CLI-008 — Offline fixtures and four-manager smoke harness

**Status:** `[ ]` **Size:** M **Area:** QA + CLI

Changes:

- Extend `tools/offline-fixture/run-offline-test.sh` and `verdaccio-config.yaml` (bash plus Verdaccio on :4873, seven steps, trap cleanup) with a manager matrix and per-manager registry/cache configuration so nothing touches the network. Do not write a second harness.
- `tools/smoke-create.ts` (new) — drive `create → install → typecheck → build → test` per manager, emitting a machine-readable result table.
- `.github/workflows/ci.yml` — a matrix job over the four managers with failure artifacts. Yarn and Bun need explicit setup steps; Bun is the likeliest source of flake.

Acceptance:

- The matrix passes offline with a cold cache: two templates × four managers = eight combinations.
- A deliberately injected `yarn.lock` in a template payload fails the harness.

### CLI-009 — Bilingual CLI documentation

**Status:** `[ ]` **Size:** S **Area:** Documentation

Changes:

- `apps/site/src/content/en/guides/` and `apps/site/src/content/es/guides/` — both hold only `.gitkeep` today, so these are the first entries. Pages: `cli-overview`, `cli-init`, `cli-add`, `cli-create`, `cli-plan`, `cli-verify`, `cli-diff-update`, `cli-recovery`.
- Frontmatter must satisfy the `guides` collection schema: `contentSchemaVersion: 1`, `title`, `description`, `keywords[]`, `locale`, `maturity`, `order`, plus `translationSourceHash` (64-hex), `translationStatus`, `translationReviewedBy`, `translationReviewedAt` on the Spanish side. Generate the hash with the CONTENT-004 tool; do not hand-write it.
- Fold the existing prose in `docs/guides/offline-install.md` into the offline/recovery guide so there is one canonical source.

Acceptance:

- Commands, flags, package names, and config keys are untranslated (Translation DoD §8.5).
- Route parity, canonical/`hreflang`, and search inclusion pass for all eight pages in both locales.
- Failure-recovery coverage for: blocked policy, failed verification, install conflict, and cancelled `create`.

### CLI-010 — Test and gate coverage

**Status:** `[ ]` **Size:** M **Area:** QA

Changes:

- New test files where none exist: `add.test.ts`, `inspect.test.ts`, `diff.test.ts`, `update.test.ts`, `create.test.ts`, `package-manager/*.test.ts`, `source-install/{conflict,rollback,verify-source}.test.ts`. Follow the existing convention: `mkdtempSync`/`rmSync` lifecycle, inline fixture builders, cwd nested two levels deep.
- Extend `ast-transform.test.ts` for the rewrite cases CLI-004 and CLI-007 introduce (component/block imports, theme CSS references).
- Tamper tests per CLI-003, in the `violations.some(v => v.includes(...))` style of `verify-registry.test.ts`.
- Register any new data trees in `DUAL_EMISSION_PACKAGES` (`tools/emit-package-source.ts`) and in `tools/audit-package-source-parity.ts`.
- `tools/phase1-gate.ts` — raise the `runTests("@solidiom/cli", 8)` count in §6 as tests land, or it becomes a false gate. Add `§11 CLI command surface` asserting `create.ts` exists, the four package-manager modules exist, and `requireVerifiedSource` is wired.
- Root `package.json` — add `"audit:cli-surface"` and `"smoke:create"` following the `"audit:x": "tsx tools/audit-x.ts"` convention.

Acceptance:

- Every command has at least one integration test exercising its `runX` core.
- The CLI test count in §6 matches reality and rises with the suite.
- `pnpm run gate:phase1` passes with the new section.

---

## 6. Open risk — SolidStart on Solid 2 beta

Decision 5 names SolidStart as CLI-007's SSR template, but its readiness is unconfirmed against this workspace's `solid-js@2.0.0-beta.24` pin.

Current external state, as of July 2026: [SolidStart's README states the maintained line is 1.x](https://github.com/solidjs/solid-start/blob/main/README.md) and the [Start v2 discussion notes that ideal Solid v2 support needs breaking changes in the Router and Meta packages](https://github.com/solidjs/solid-start/discussions/2119); a [community report from April 2026 describes the DeVinxi work as finished with production SolidStart v2 usage](https://danieljcafonso.substack.com/i/193077485/found-online). By contrast, [TanStack shipped Solid 2.0 beta support across Router, Start, and Query](https://tanstack.com/blog/tanstack-start-solid-v2?) and [TanStack Start is at Release Candidate with a stable API](https://tanstack.com/start/latest/docs/framework/solid/overview). _(Sources paraphrased; content was rephrased for compliance with licensing restrictions.)_

**Spike, before CLI-007 PR 2 (half a day):** does a published SolidStart release build and start on `solid-js@2.0.0-beta.24` with `@solidjs/router@0.17.x-next`?

- Yes → SolidStart is confirmed; Decision 5 stands unchanged.
- No → `tanstack-start-solid` becomes CLI-007's SSR template, and SolidStart moves to `TPL-000` once its v2 line stabilizes. Accept that the second template then differs in router _and_ SSR, so the same-router SSR validation is deferred rather than obtained.

CLI-007 PR 1 and all of Track A are unaffected, so this can wait several weeks at no cost.

Related note: [`@tanstack/solid-start` was compromised through an npm account takeover in May 2026](https://advisories.gitlab.com/npm/@tanstack/solid-start/GMS-2026-434/), which TanStack [addressed in a published hardening followup](https://tanstack.com/blog/incident-followup). Not disqualifying — a registry-account compromise, since remediated — but it argues for exact-pinning every template dependency and routing them through CLI-003's verification, which this plan already requires.

---

## 7. Verification

Per pull request:

```sh
pnpm --filter @solidiom/cli test
pnpm --filter @solidiom/cli typecheck
pnpm --filter @solidiom/cli build
pnpm run source:emit:check
pnpm run audit:package-source-parity
pnpm run gate:phase1
```

Additionally:

- `pnpm run registry:build` whenever a `nx.metadata.registry` field or the generator changes (CLI-002).
- `pnpm run smoke:create` for CLI-007 and CLI-008 changes.
- A changeset in `.changeset/` for every public-contract change: the `LockEntry` field additions, `ConfigSchema`/`PolicySchema` additions, the `deliverables` shape change, and the new `create` command. No lock-format migration note is needed (Decision 2).

---

## 8. Progress

| Status | Task    | Notes                                                                       |
| ------ | ------- | --------------------------------------------------------------------------- |
| [x]    | CLI-002 | Complete. Registry regenerated; button carries a real component deliverable |
| [ ]    | CLI-003 | Needs the CI signing key provisioned first (Decision 1, coordinate OPS-002) |
| [ ]    | CLI-004 | Theme installs are multi-artifact                                           |
| [x]    | CLI-005 | Complete. `runAdd` is now async; `--install`/`--package-manager` added      |
| [ ]    | CLI-006 | `@clack/prompts` already installed and unused                               |
| [ ]    | CLI-007 | Two stacked PRs; PR 2 gated on the §6 spike                                 |
| [ ]    | CLI-008 | Extends `tools/offline-fixture/`, does not replace it                       |
| [ ]    | CLI-009 | First entries in `en/guides/` and `es/guides/`                              |
| [ ]    | CLI-010 | Must raise the phase1-gate §6 CLI test count                                |
