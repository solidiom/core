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

1. **F1 — add `jsdom` + refresh lockfile + harden `run-a11y.ts`.** Unblocks `a11y-axe-scan` and `test-browser` (and the browser step of the matrix). Highest impact, lowest risk.
2. **F2 — fix `source-install.test.ts` fixture paths.** Unblocks `test-node` and the `pnpm test` step of the matrix.
3. **F3 — decide and apply the `docs-astro-poc` / Node 20 remediation** (Option A or B recommended). Unblocks the `test-solid-matrix` Node 20 tiers.
4. **Full local verification** (clean, no nx cache) mirroring the CI job set:
   ```sh
   rm -rf node_modules packages/*/node_modules apps/*/node_modules
   pnpm install --frozen-lockfile
   pnpm exec nx reset
   pnpm build
   pnpm typecheck
   pnpm test
   pnpm test:browser
   pnpm run test:a11y && pnpm run report:axe
   pnpm run gate:phase0
   pnpm run gate:phase1
   ```
   Also reproduce the Node-20 tier locally if feasible (`node scripts/set-solid-version.mjs low` on a Node 20 runtime) to confirm F3.
5. **Local `act` dry run** of the affected jobs (native arm64, per `README.md`), then commit and push and confirm the full hosted CI run goes green through `phase1-gate` / `phase0-gate`.

## Verification checklist

- [ ] `pnpm install --frozen-lockfile` succeeds from a fully clean `node_modules` (proves F1 lockfile fix and no other missing deps).
- [ ] `pnpm test:browser` exits 0 (F1).
- [ ] `pnpm run test:a11y` exits 0 and writes `artifacts/axe-results.json` (F1).
- [ ] `pnpm --filter @solidiom/cli test` passes, including under a shallow `TMPDIR=/tmp` (F2).
- [ ] Workspace `pnpm build` succeeds on Node 20 **or** `docs-astro-poc` is removed/excluded from the Node 20 path (F3).
- [ ] Hosted CI run on `solidiom/core` reaches and passes `phase1-gate` and `phase0-gate`.

## Notes / open decisions

- **F3 requires a product decision** (keep vs. remove `docs-astro-poc`; keep vs. drop Node 20 support). This is the only item that is not a purely mechanical fix.
- The `@solidiom/docs:build` and `@solidiom/probe-primitive:build` segfaults seen earlier were **local `act`/qemu emulation artifacts only** and do **not** reproduce on hosted CI (both built fine in this run). They are not tracked here as failures.
