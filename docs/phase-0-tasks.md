---
id: solidiom-phase-0-completion-tasks
title: "Phase 0 Completion Tasks"
sidebar_label: Phase 0 Tasks
description: Repository-grounded work plan for restoring and fully proving the Solidiom Phase 0 architectural baseline.
doc_type: reference
audience: "Solidiom maintainers, platform engineers, release engineers"
tags: [solidiom, phase-0, architecture, gates, remediation]
version: "1.0"
paired_plan: opencenter-solidiom-implementation-plan
---

> **Purpose:** Defines the remaining work required to make Phase 0 reproducibly complete in the current repository. This document supplements `solidiom-implementation-plan.md`; it does not replace the Phase 0 architecture or broaden Phase 0 into later primitive, beta, or GA work.

## Current status

The repository contains most of the Phase 0 implementation, and the direct gate passes its runtime, hard-slice, adapter, CLI, benchmark, registry, and dual-emission checks. The latest clean local validation produced:

| Check                                | Result                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `pnpm exec tsx tools/phase0-gate.ts` | 32 passed, 4 failed                                                         |
| Immediate failures                   | Migration transform, legacy source, sunset metadata, `layer:legacy` tag     |
| `pnpm nx run phase0:gate`            | Fails because Nx has no `phase0` project/target                             |
| Chromium browser suite               | Fails during Vitest startup because the provider uses the pre-v4 string API |
| Package/source parity                | Structural test exists but is excluded by the root Vitest include rules     |

The four direct gate failures are necessary but not sufficient to finish Phase 0. Several checked Phase 0 tasks claim CI, Changesets, browser execution, a rolling Solid matrix, behavioral package/source parity, and durable release evidence that the current repository cannot reproduce.

Progress convention: `[ ]` open, `[~]` in progress, `[x]` complete, `[!]` blocked.

## Completion standard

Phase 0 is complete only when all of the following are true:

1. Every Phase 0 implementation and conformance requirement is executable from a clean checkout.
2. The migration and legacy facade exist, are structurally isolated, and pass behavioral fixtures.
3. Browser-mode tests run against the installed Vitest version.
4. Package and source modes run the same behavior suite, not only file-existence checks.
5. The supported Solid beta matrix is internally consistent and runs in CI.
6. One documented canonical gate command succeeds locally and in CI.
7. Evidence is tied to a commit SHA and CI run or immutable artifact.

## Execution order

### P0.1 — Establish an attributable baseline

- [ ] Assign named DRIs for platform, migration/legacy, testing, and release engineering.
- [ ] Create a real Git commit baseline. The current checkout has no resolvable `HEAD`, so evidence cannot be tied to a revision.
- [ ] Ensure generated output and dependency directories are ignored appropriately and are not used as proof of source completion.
- [ ] Record the supported Node, pnpm, TypeScript, Vitest, Playwright, and Solid versions.
- [ ] Capture the initial failing gate output as the before-state artifact.

**Exit evidence:** commit SHA, toolchain version report, and an archived Phase 0 gate run showing the expected initial failures.

### P0.2 — Restore the workspace, Changesets, and CI skeleton

This closes the repository gaps in Task 1 and provides the execution environment needed by later tasks.

- [ ] Restore `.changeset/config.json` and verify Changesets can calculate package versions without publishing.
- [ ] Add `.github/workflows/ci.yml` with frozen installation, typecheck, build, node tests, browser tests, and phase gates.
- [ ] Add `.github/workflows/release.yml` with a non-publishing validation path and explicit gate dependency.
- [ ] Confirm `pnpm-workspace.yaml` covers `packages/*`, `apps/*`, `registry/*`, `migrations/*`, `legacy/*`, and `tests/*`.
- [ ] Verify Nx layer tags and module-boundary rules reject a deliberate wrong-layer import.
- [ ] Choose and wire one canonical Phase 0 command. Either make `pnpm nx run phase0:gate` real or replace it everywhere with a root script backed by `tools/phase0-gate.ts`.

**Exit evidence:** green CI bootstrap run, Changesets status output, failing boundary fixture, and a working canonical gate command.

### P0.3 — Repair browser-mode testing

This restores the executable proof required by Tasks 3, 6, 7, 12, 15, 16, and 17.

- [ ] Update `vitest.browser.config.ts` and `tools/test/vitest.browser.config.ts` to use the Vitest v4 Playwright provider factory from `@vitest/browser-playwright`.
- [ ] Update `tools/test/vitest.cross-browser.config.ts` at the same time so the configurations do not diverge.
- [ ] Verify a real Chromium component render and focus assertion.
- [ ] Verify collection keyboard navigation, overlay focus management, and hard-slice browser tests actually execute.
- [ ] Configure Playwright browser installation in CI.
- [ ] Upload traces and screenshots for an injected browser-test failure, then remove the injection.

**Exit evidence:** successful Chromium run, test count, browser version, and a CI artifact from the temporary failure proof.

### P0.4 — Reconcile the Solid 2 rolling beta window

This makes Task 4 reproducible instead of relying on stale version files.

- [ ] Select the current `{low, mid, high}` three-beta window.
- [ ] Align `package.json`, `pnpm-workspace.yaml`, `tools/solid-matrix.json`, bridge-package metadata, and docs to that window.
- [ ] Restore or replace `scripts/update-solid-window.mts`; update the matrix description if a different script becomes authoritative.
- [ ] Ensure one catalog or policy source controls `solid-js` and the matching Solid toolchain dependencies.
- [ ] Run the probe packages over `{low, mid, high} × {node 20, node 22} × chromium`.
- [ ] Add a Changeset when a supported beta window changes package compatibility.

**Exit evidence:** six green matrix jobs, synchronized version files, and a deterministic window-update dry run.

### P0.5 — Restore the shadcn-solid Dialog migration

This closes the first missing half of Task 26.

- [ ] Create `migrations/shadcn-solid-dialog/transform.ts` using AST transformations for imports, identifiers, props, and JSX.
- [ ] Add positive fixtures for supported shadcn-solid Dialog usage.
- [ ] Add negative fixtures that produce actionable diagnostics without unsafe rewrites.
- [ ] Prove idempotence by running the transform twice with zero second-run diff.
- [ ] Implement patch-only or dry-run behavior that never mutates the fixture.
- [ ] Verify transformed output builds and uses the Solidiom Dialog contract.
- [ ] Prevent migration code from being imported by runtime, primitive, adapter, or recipe packages.

**Exit evidence:** fixture matrix, idempotence output, patch-only output, transformed-app build, and boundary-rule result.

### P0.6 — Restore the shadcn-solid legacy facade

This closes the second missing half of Task 26 and all four current Phase 0 gate failures.

- [ ] Create `legacy/shadcn-solid-dialog/src/index.ts` as an explicit facade over `@solidiom/dialog`.
- [ ] Add `legacy/shadcn-solid-dialog/package.json` with publish metadata and Nx tag `layer:legacy`.
- [ ] Add `solidiom.sunset` metadata with replacement package, deprecation intent, removal policy, and migration command. Do not invent a GA removal date before the release policy permits one.
- [ ] Emit a development-only deprecation warning without changing production behavior.
- [ ] Reject or diagnose transitive/implicit installation where the facade policy requires explicit opt-in.
- [ ] Add conformance tests proving the facade preserves the supported Dialog behavior and public names.
- [ ] Ensure no primitive imports the legacy layer.

**Exit evidence:** legacy package build, conformance tests, warning assertion, metadata assertion, and layer-boundary fixture.

### P0.7 — Replace structural parity with behavioral parity

The existing `tests/package-source-parity/parity.test.ts` checks only `dist/`, `source/`, and export declarations and is excluded by `vitest.config.ts`.

- [ ] Add a test configuration or workspace project that discovers `tests/package-source-parity/**/*.test.ts`.
- [ ] Run the same conformance suite against package and source imports for Dialog, Select, Calendar, and Carousel.
- [ ] Compare behavior, DOM semantics, state attributes, keyboard interaction, focus behavior, and form participation where applicable.
- [ ] Include SSR/hydration verification for both modes.
- [ ] Build or pack packages before package-mode tests so stale `dist/` cannot satisfy the suite.
- [ ] Make a package/source mismatch fail Phase 0 and CI.
- [ ] Keep structural export checks as a fast preliminary check, not as parity proof.

**Exit evidence:** discovered parity test run, per-primitive package/source results, and a negative fixture proving divergent behavior fails.

### P0.8 — Complete package and registry consumer proofs

This closes the evidence gaps in Tasks 2, 13, 20, and 21.

- [ ] Build and pack `@solidiom/runtime` and `@solidiom/dialog` into an isolated temporary directory.
- [ ] Verify tarballs contain the expected `dist/` and `source/` files and exclude tests.
- [ ] Install the tarballs in a scratch consumer with no workspace links.
- [ ] Import through the default and `solid` export conditions.
- [ ] Exercise Dialog from the packed package and from materialized source under the same smoke behavior.
- [ ] Regenerate `registry/index.json` twice and require zero diff.
- [ ] Run source installation for Dialog and Select and prove shared runtime files are deduplicated.
- [ ] Archive tarball names, integrity digests, and consumer output.

**Exit evidence:** tarball manifests and digests, isolated-consumer build/test, deterministic registry diff, and source-install file manifest.

### P0.9 — Harden the Phase 0 gate

The current gate is useful but does not mechanically prove every criterion claimed by Task 27.

- [ ] Correct test-count labels and thresholds. The gate currently labels Dialog and Select as `>=9` while invoking lower minimums.
- [ ] Add the migration fixture suite and legacy conformance suite, not only file-existence checks.
- [ ] Add behavioral package/source parity execution.
- [ ] Add SSR/hydration checks.
- [ ] Add adapter output-shape and side-effect conformance checks, including no adapter-owned classes, roles, ARIA, or semantic attributes.
- [ ] Add three-way update success, conflict, validation-failure, and no-write fixtures.
- [ ] Add packed-package and isolated-consumer verification.
- [ ] Add checks for the browser harness and Solid matrix configuration.
- [ ] Add positive and negative gate fixtures for every criterion.
- [ ] Make lower-level command failures print actionable captured output rather than only a failed label.
- [ ] Update the documented check count to the actual count generated by the gate.

**Exit evidence:** green positive fixture, one independently failing negative fixture per criterion, and machine-readable gate output.

### P0.10 — Run the final clean-checkout acceptance sequence

Run from a clean checkout using the committed lockfile:

```sh
pnpm install --frozen-lockfile
pnpm exec tsx tools/phase0-gate.ts
pnpm exec vitest run --config vitest.browser.config.ts
pnpm exec vitest run --config tools/test/vitest.cross-browser.config.ts
pnpm --filter ./apps/docs build
```

Also run the selected canonical Nx or root gate command and the full Solid beta/Node matrix in CI.

- [ ] Confirm the migration and legacy directories are included in the workspace install.
- [ ] Confirm no test relies on pre-existing `dist/` or `source/` output.
- [ ] Confirm the working tree remains clean after generation and validation.
- [ ] Record exact test counts and explain any documented skips.
- [ ] Attach the commit SHA, CI run ID, package digests, browser versions, and matrix versions.
- [ ] Rerun the gate from the published or packed candidate artifacts where applicable.

**Exit evidence:** clean working tree, green local sequence, green CI matrix, and immutable evidence links.

### P0.11 — Reconcile roadmap status

Only after P0.1–P0.10 pass:

- [ ] Update Tasks 1, 3, 4, 13, 22, 26, and 27 in `solidiom-implementation-plan.md` with current evidence.
- [ ] Keep implementation tasks checked only when their stated verification is executable.
- [ ] Replace stale check counts and commands.
- [ ] Link CI runs or artifact digests rather than relying only on status Markdown.
- [ ] Mark Phase 0 exited only after the final gate passes from a clean checkout.

## Critical path

```text
Attributable baseline
  -> workspace/CI restoration
  -> browser harness and Solid matrix
  -> migration and legacy facade
  -> behavioral package/source parity
  -> consumer proofs
  -> hardened Phase 0 gate
  -> clean-checkout CI evidence
  -> roadmap reconciliation
```

Migration/legacy restoration is the immediate gate blocker. Browser execution, matrix consistency, behavioral parity, and durable CI evidence are parallel proof blockers that must also close before Phase 0 can truthfully be considered complete.

## Out of scope

The following work must not delay Phase 0 unless it exposes a regression in a Phase 0 contract:

- RangeCalendar and other second-wave components
- full beta accessibility certification
- the 13-package public/private backlog decision
- signed beta catalogs and channel promotion
- Phase 3A compile-time incubation
- Phase 3B authoring generators
- Solid 2 GA and stable v1/v2 release work

## Phase 0 definition of done

- [ ] Phase 0 implementation, node, browser, parity, migration, legacy, registry, and consumer checks all pass.
- [ ] The Solid rolling beta matrix is green and internally consistent.
- [ ] The canonical gate command works locally and in CI.
- [ ] Every gate criterion has a negative fixture.
- [ ] The final run starts from a clean checkout and leaves it clean.
- [ ] Evidence is tied to a commit SHA, CI run ID, and immutable package artifacts.
- [ ] `solidiom-implementation-plan.md` reflects the reproduced result.
