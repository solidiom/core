---
id: ci-failures-remediation
title: "CI Failure Analysis and Remediation Plan"
doc_type: reference
audience: "Solidiom maintainers, platform engineers"
tags: [ci, failures, remediation, github-actions]
status: open
---

> **Purpose:** Documents the failures observed on the first hosted CI run that progressed past the `build` stage (`solidiom/core` commit `e10c698`), their root causes, and a sequenced plan to resolve them. Every failure here is a **pre-existing bug unrelated to the legacy-removal / Node-20-action work in `e10c698`** — they were simply never exercised before, because prior CI runs failed at `install` or `build` and never reached the test jobs.

## Context

Commit `e10c698` was the first push where `install`, `build`, and `typecheck` all passed on hosted GitHub Actions. That allowed the downstream test jobs (`test-node`, `test-browser`, `a11y-axe-scan`, `test-solid-matrix`) to run for the first time, which surfaced four latent defects. All four share a common theme: **they pass in the local dev environment but fail in a clean, frozen-install CI environment** (or on a Node version the local machine does not use).

Run reference: `https://github.com/solidiom/core/actions/runs/30236350859`

| Job | Result | Failure | Root cause |
| --- | --- | --- | --- |
| `install`, `build`, `typecheck` | ✅ pass | — | — |
| `a11y-axe-scan` | ❌ fail | F1 | Missing optional peer dependency `jsdom` in frozen install |
| `test-browser` | ❌ fail | F1 | Same — missing `jsdom` |
| `test-node (22)` | ❌ fail | F2 | Test fixture path escapes the temp dir to filesystem root |
| `test-node (20)` | ⏹ cancelled | F2 | Cascade — would hit the same path bug |
| `test-solid-matrix (low, 20)` | ❌ fail | F3 | `@solidiom/docs-astro-poc` build requires Node ≥ 22.12; matrix tests Node 20 |
| `test-solid-matrix (*, 20)` others | ⏹ cancelled | F3 | Cascade — same Node-20 incompatibility |
| `test-solid-matrix (*, 22)` | ⏹ cancelled | F1 (likely) | Cascade — browser step would hit missing `jsdom` |
| `phase1-gate`, `phase0-gate` | ⏹ skipped | — | Skipped because upstream jobs failed |

---

## F1 — Missing `jsdom` dependency breaks both browser-mode test jobs

**Affected jobs:** `a11y-axe-scan`, `test-browser` (and, by cascade, the browser step of every `test-solid-matrix` tier).

**Symptom:**
```
MISSING DEPENDENCY  Cannot find dependency 'jsdom'
...
Test Files  1 passed (1)
      Tests  40 passed (40)
 ELIFECYCLE  Command failed with exit code 1.
```
The tests themselves pass (40/40 for the a11y suite, all primitives, zero violations), but the Vitest process still exits non-zero because it cannot resolve `jsdom`.

**Root cause:** `jsdom` is an **optional peer dependency of `vitest`** (see `pnpm-lock.yaml`: `jsdom: '*'` under Vitest's `peerDependenciesMeta` with `optional: true`). Vitest attempts to resolve it at startup even for browser-mode configs. In the local dev environment `jsdom` happens to be present (hoisted into `node_modules` from a prior non-frozen install), so the resolution succeeds and the process exits 0. Under CI's `pnpm install --frozen-lockfile` with pnpm's strict isolation, `jsdom` is **not** installed, so Vitest emits the `MISSING DEPENDENCY` banner and exits non-zero.

This is the **same class of defect** as the previously-fixed `@types/node` gap (commit `ea92123`): a dependency that is only present locally through hoisting and is absent in a clean frozen install.

**Why `run-a11y.ts` reports it with no error message:** `tools/run-a11y.ts` propagates the spawned Vitest exit code silently:
```ts
if (run.status !== 0) {
  process.exitCode = run.status ?? 1;
  return;   // <- no diagnostic printed
}
```
So the a11y job failed with only `ELIFECYCLE ... exit code 1` and no explanation, even though the scan artifact would have validated cleanly (39/39 primitives present, zero violations — verified from the raw job log).

**Remediation (recommended):**
1. Add `jsdom` as an explicit root `devDependency`, pinned (e.g. `"jsdom": "^26.0.0"` — confirm the version Vitest 4 expects).
2. Run `pnpm install` to refresh `pnpm-lock.yaml`.
3. Verify with a clean frozen install locally:
   ```sh
   rm -rf node_modules packages/*/node_modules apps/*/node_modules
   pnpm install --frozen-lockfile
   pnpm run test:a11y
   pnpm test:browser
   ```

**Alternative considered:** Configure Vitest to not require `jsdom` at all (e.g. pin the node-side `environment` explicitly so it never probes for `jsdom`). Rejected as the primary fix because the exact resolution trigger in Vitest 4 browser mode is not fully pinned down, and adding the dependency is the low-risk, convention-matching fix already used for `@types/node`. Worth revisiting later to remove an unused dependency if Vitest can be told not to probe.

**Secondary hardening (recommended):** Make `tools/run-a11y.ts` print a diagnostic before propagating a non-zero Vitest exit, so a future infrastructure failure of this kind is not silent:
```ts
if (run.status !== 0) {
  console.error(`✗ axe browser suite exited with code ${run.status} (tests may have passed; check for missing dependencies or environment errors above)`);
  process.exitCode = run.status ?? 1;
  return;
}
```

**Effort:** Low. **Risk:** Low (additive dependency + lockfile refresh).

---

## F2 — `source-install.test.ts` fixture path escapes the temp directory

**Affected jobs:** `test-node (22)` (and, by cascade, `test-node (20)` and the `pnpm test` step of the `test-solid-matrix` tiers).

**Symptom:**
```
Error: EACCES: permission denied, mkdir '/packages/dialog/source'
 ❯ src/commands/source-install.test.ts:79:7
Serialized Error: { errno: -13, code: 'EACCES', syscall: 'mkdir', path: '/packages/dialog/source' }
```
Note the path is `/packages/dialog/source` — rooted at the **filesystem root**, not the repository.

**Root cause:** In `packages/cli/src/commands/source-install.test.ts`, two tests (lines 78 and 107) build a fixture path by walking up from the test's temp working directory:
```ts
const cwd = createTmpDir()               // e.g. os.tmpdir()/solidiom-test-...
const primitiveSource = join(cwd, "..", "..", "packages", "dialog", "source")
mkdirSync(primitiveSource, { recursive: true })
```
This assumes `cwd` is nested exactly two levels below a directory that contains `packages/`. On the local dev machine `os.tmpdir()` happens to sit at a depth where `../../packages` either resolves somewhere writable or the test is skipped/passes by accident. On the CI runner, `os.tmpdir()` is shallow (e.g. `/tmp/solidiom-test-xxx`), so `../..` resolves to the filesystem root `/`, and the test tries to `mkdir /packages/dialog/source` — denied.

The test is trying to reach the **real repository's** `packages/dialog/source`, which is a fragile coupling between an isolated temp working directory and the repo layout.

**Remediation (recommended):** Make the fixture self-contained inside the temp dir instead of walking up to the real repo. Create the "primitive source" fixture under `cwd` (or a sibling temp path) and point the install logic at it explicitly, rather than relying on relative traversal to the real `packages/dialog/source`. Both occurrences (lines 78 and 107) need the same change.

**Verify:**
```sh
pnpm --filter @solidiom/cli test
```
and confirm under a shallow temp path (the CI condition) by running with a forced shallow `TMPDIR`:
```sh
TMPDIR=/tmp pnpm --filter @solidiom/cli test
```

**Effort:** Low–medium (test-only change, two call sites, must preserve the behavior each test asserts). **Risk:** Low (no production code changes).

---

## F3 — `@solidiom/docs-astro-poc` is incompatible with the Node 20 matrix tier

**Affected jobs:** `test-solid-matrix (low|mid|high, 20)`.

**Symptom:**
```
> @solidiom/docs-astro-poc@ build
> astro build && pagefind --site dist

Node.js v20.20.2 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.12.0"
 ELIFECYCLE  Command failed with exit code 1.
```

**Root cause:** The `test-solid-matrix` job builds the entire workspace (`pnpm build`) under a `{node 20, node 22}` matrix. `@solidiom/docs-astro-poc` depends on Astro, which requires Node `>=22.12.0`. Its own `package.json` misleadingly declares `engines.node: ">=20.0.0"`, so nothing catches the mismatch until Astro itself refuses to run on Node 20.

This is a genuine policy conflict: the repo root declares `engines.node: ">=20.0.0"` and the Solid matrix deliberately tests Node 20, but one workspace package cannot build on Node 20.

**Remediation — decision required (options, not yet chosen):**

- **Option A — Remove `@solidiom/docs-astro-poc`.** It is a proof-of-concept (see prior discussion about it being a second, non-canonical docs app). If `apps/docs` is the canonical docs site, deleting the POC removes the conflict entirely and reduces confusion. Lowest long-term maintenance.
- **Option B — Exclude `docs-astro-poc` (and other Node-22-only packages) from the matrix `build`.** Keep the POC but scope it out of the Node 20 tier, e.g. `nx run-many -t build --exclude=@solidiom/docs-astro-poc` in the matrix job, or via an nx tag. Keeps the POC building on the primary Node 22 path only.
- **Option C — Drop Node 20 from the Solid matrix and bump `engines.node` to `>=22.12.0`.** Aligns the repo's stated Node support with reality. This is the cleanest if Node 20 support is not actually a requirement — but it is a support-policy change and should be confirmed against the roadmap (`docs/solidiom-implementation-plan.md` §4 describes the `{node 20, node 22}` matrix as intentional).
- **Option D — Correct `docs-astro-poc`'s `engines.node` to `>=22.12.0`** and make the matrix respect per-package engines (skip incompatible packages on incompatible tiers). More complex; nx does not skip on `engines` by default.

**Recommended:** Option A if the POC is disposable (matches the earlier "retire the POC" direction), otherwise Option B as the least-invasive way to keep it. Both avoid changing the repo's Node-support policy. Option C only if we consciously decide to drop Node 20.

**Effort:** Low (A or B). **Risk:** Low for A/B; Medium for C (changes support policy and affects consumers).

---

## Sequenced resolution plan

F1, F2, F3 resolved in commit `d678a76`. F4 resolved in the follow-up commit (cache-path fix). F5 remains open.

## Verification checklist

- [x] `pnpm install --frozen-lockfile` succeeds from a fully clean `node_modules` (F1).
- [x] `pnpm test:browser` exits 0 (F1).
- [x] `pnpm run test:a11y` exits 0 and writes `artifacts/axe-results.json` (F1).
- [x] `pnpm --filter @solidiom/cli test` passes, including under a shallow `TMPDIR=/tmp` (F2).
- [x] Workspace `pnpm build` succeeds with new Node floor (F3).
- [x] Hosted CI: `a11y-axe-scan` ✅, `test-browser` ✅ (confirmed run `30238710110`).
- [ ] Hosted CI: `test-node` passes (blocked by F4 cache-path gap — now fixed, pending push).
- [ ] Hosted CI: `test-solid-matrix` all tiers pass (blocked by F5 — open).
- [ ] Hosted CI: `phase1-gate` and `phase0-gate` pass.

---

## F4 — CI cache does not include `tests/*/node_modules` (RESOLVED)

**Affected jobs:** `test-node` (all tiers).

**Symptom:**
```
Error: Cannot find package '@solidiom/dialog' imported from tests/package-source-parity/parity.test.ts
```
Build succeeds (74 projects, `dist/` exists), but the parity test's dynamic `import("@solidiom/dialog")` fails because the workspace symlinks in `tests/package-source-parity/node_modules/@solidiom/` were never restored from cache.

**Root cause:** `actions/cache/save` and all `cache/restore` blocks specified `node_modules`, `packages/*/node_modules`, `apps/*/node_modules` — missing `tests/*/node_modules`. Workspace packages in `tests/` had no symlinks after cache restore.

**Fix applied:** Added `tests/*/node_modules` to all 10 cache path blocks (1 save + 9 restore) in `ci.yml`.

---

## F5 — Parity test fails under non-high Solid matrix tiers (OPEN)

**Affected jobs:** `test-solid-matrix` (non-high tiers, e.g. `mid, 26`).

**Symptom:**
```
Error: Cannot find package 'react/jsx-dev-runtime' imported from packages/dialog/source/dialog.tsx
```

**Root cause:** The `source/` canonical TSX files are pre-compiled with the `high` Solid beta's `babel-preset-solid` transform. When the solid-matrix job switches to a different beta tier (`low`/`mid`) via `set-solid-version.mjs` and re-installs, the parity test imports from `source/` directly — but those files contain JSX compiled for a different babel-preset-solid version, which emits `react/jsx-dev-runtime` instead of the expected Solid JSX calls.

This is a **design gap** in how the parity test interacts with the solid-matrix: the `source/` emission is tier-specific, but only one tier's output exists on disk at a time. The parity test assumes all tiers can import the same pre-built `source/` files, which isn't true across Solid beta API boundaries.

**Remediation options (not yet decided):**
- **A.** Exclude `@solidiom/tests-package-source-parity` from the solid-matrix `pnpm test` (only run it in the primary `test-node` job which uses the `high` tier). The matrix's purpose is primitive/adapter compat, not source-parity.
- **B.** Have the matrix job rebuild `source/` emissions for its active tier before running parity tests.
- **C.** Skip the parity test's dynamic-import cases when the active Solid version doesn't match the pre-built source tier.

**Recommended:** A (exclude from matrix, run only in primary test-node).

---

## Notes

- The `@solidiom/docs:build` and `@solidiom/probe-primitive:build` segfaults seen earlier were **local `act`/qemu emulation artifacts only** and do **not** reproduce on hosted CI (both built fine in this run). They are not tracked here as failures.
