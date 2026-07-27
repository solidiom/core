---
id: solidiom-phase-1-completion-tasks
title: "Phase 1 Completion Tasks"
sidebar_label: Phase 1 Tasks
description: Repository-grounded work plan and local evidence for closing Phase 1 (Tasks 28–42).
doc_type: reference
audience: "Solidiom maintainers, platform engineers, accessibility reviewers"
tags: [solidiom, phase-1, primitives, eslint, accessibility, gates, remediation]
version: "1.1"
paired_plan: opencenter-solidiom-implementation-plan
---

> **Purpose:** Tracks the remediation work required to make the Phase 1 claims executable. It supplements `solidiom-implementation-plan.md`; it does not broaden Phase 1 into later beta, GA, or authoring-tooling work.

## Current status

The six executable remediation tracks are complete locally. On 2026-07-26, after aligning the Solid 2 window through `2.0.0-beta.24`, `pnpm run gate:phase1` passed **197/197** checks, including a Chromium axe run for the exact 39-entry public surface. The cross-browser matrix also passed 858 tests across Chromium, Firefox, and WebKit. `docs/phase1-acceptance-evidence.md` records the commands and scope.

This is **pre-CI evidence**, not a Phase 1 exit declaration: the changes are not yet committed and no hosted CI run exists for the resulting commit. The generated local axe report therefore correctly identifies its source as local rather than CI evidence.

| Area                             | Tasks  | Executable resolution                                                                                                                  |
| -------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Anatomy and semantics lint rules | 41     | Registered rules and positive/negative fixtures; package suite passes.                                                                 |
| `no-adapter-import-of-recipes`   | 28     | Named, registered, independently tested rule.                                                                                          |
| Per-primitive axe and CI         | 29, 39 | Dedicated Chromium suite emits 39 structured results; runner validates and writes an artifact; CI invokes it before report generation. |
| Recipe drift                     | 36, 37 | Strict CSS/TSX correspondence audit, reason-bearing composition exceptions, and negative fixtures.                                     |
| Umbrella purity                  | 40     | Exact 39-entry re-export audit with negative fixtures.                                                                                 |
| Phase 1 gate                     | 42     | Gate executes the a11y suite, validates/generates its report, executes audit fixtures, and passed 197/197 locally.                     |

Progress convention: `[ ]` open, `[~]` in progress, `[x]` complete, `[!]` blocked.

## Completion standard

Phase 1 can be declared complete only when all of the following are true:

1. Every ESLint rule named by Tasks 28 and 41 exists as a tested rule and is registered in the plugin.
2. Consumer-facing anatomy, accessible-name, and forbidden-prop violations are caught by lint with positive and negative fixtures.
3. Every public primitive is scanned by axe from executable test code, and an a11y check blocks CI on regressions.
4. Recipe CSS and TSX cannot silently diverge; a drift check fails on divergence.
5. The umbrella package is proven to contain only re-exports and to match the intended public surface.
6. The Phase 1 exit gate enforces every Phase 1 primitive and every new verification artifact above.
7. Evidence is tied to the commit that contains these changes and to a successful hosted CI run.

## Remediation record

### P1.1 — Task 41: anatomy and semantics ESLint rules

- [x] Added `packages/eslint-plugin-solidiom/src/anatomy-registry.ts` for Dialog, Menu, Popover, Tooltip, Combobox, Listbox, Accordion, and Tabs.
- [x] Added `require-primitive-parts`, `require-accessible-name`, and `no-forbidden-primitive-props`.
- [x] Registered the rules and added positive and negative fixtures.

**Local evidence:** `pnpm --filter @solidiom/eslint-plugin-solidiom test` passes 70 tests across 9 test files.

### P1.2 — Task 28: `no-adapter-import-of-recipes`

- [x] Added and registered `packages/eslint-plugin-solidiom/src/rules/no-adapter-import-of-recipes.ts`.
- [x] Added dedicated pass/fail fixtures.

**Local evidence:** included in the 70-test ESLint plugin suite and the 197-check Phase 1 gate.

### P1.3 — Tasks 29 and 39: per-primitive axe scans and CI a11y gate

- [x] `tests/a11y/primitives-axe-scan.browser.test.tsx` parametrizes all 39 entries from `tools/axe-results.ts`.
- [x] `tools/run-a11y.ts` removes stale output, executes the dedicated Chromium Vitest configuration, parses emitted structured results, rejects missing/duplicate/invalid/violating results, and writes `artifacts/axe-results.json` only after a successful run.
- [x] `tools/generate-axe-report.ts` rejects absent or malformed artifacts and regenerates `docs/axe-scan-results.md`; it does not synthesize pass data.
- [x] CI job `a11y-axe-scan` runs `pnpm run test:a11y`, then `pnpm run report:axe`, and uploads both JSON and Markdown evidence only on success.
- [x] NVDA, JAWS, TalkBack, and full styled certification remain Phase 4 work.
- [~] Run the changed workflow from a committed revision and link the resulting CI run in the acceptance evidence.

**Local evidence:** `pnpm run test:a11y` passed 40 tests and wrote 39 results with zero violations; `pnpm run report:axe` generated the report.

### P1.4 — Tasks 36 and 37: recipe dual-emission drift check

- [x] Chose audited separate CSS/TSX recipe sources rather than a larger canonical-source generation refactor.
- [x] `tools/audit-recipe-dual-emission.ts` enforces stylesheet/recipe one-to-one mapping, primitive scope agreement, and CSS part coverage; intentional composition omissions require a reason-bearing allowlist entry.
- [x] Added negative fixtures and wired the audit into the Phase 1 gate.

**Local evidence:** `pnpm run audit:recipe-drift` and its fixture suite pass.

### P1.5 — Task 40: umbrella re-export purity

- [x] `tools/audit-umbrella-purity.ts` enforces pure `export * as … from "@solidiom/*"` lines and the exact 39-entry public surface.
- [x] Added fixtures for implementation code, missing/extra/duplicate/malformed exports.
- [x] Wired the audit and its fixtures into the Phase 1 gate.

**Local evidence:** `pnpm run audit:umbrella-purity` and its fixture suite pass.

### P1.6 — Task 42: gate coverage

- [x] Gate coverage includes `field`, `toggle`, `toggle-group`, `radio-group`, and `pagination`.
- [x] The gate executes the a11y runner and report generator rather than checking only test text.
- [x] The gate executes audit/result-validation fixtures and both production audits.
- [x] `pnpm run gate:phase1` passed **197/197** checks locally.

### P1.7 — roadmap reconciliation

- [x] Updated the Phase 1 roadmap claims, verification commands, and check count.
- [x] Added `docs/phase1-acceptance-evidence.md` to distinguish local execution from CI-backed evidence.
- [~] Commit the changes, run CI, and append the commit SHA and successful CI run URL before declaring the Phase 1 exit.

## Local verification snapshot

| Command                                                                                                                       | Result                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm test:browser`                                                                                                           | 99 test files and 858 tests passed across Chromium, Firefox, and WebKit. |
| `pnpm typecheck`                                                                                                              | Passed for 74 projects and 40 dependent tasks.                           |
| `pnpm run test:a11y`                                                                                                          | 40 passed tests; 39 exact primitive results; zero violations.            |
| `pnpm run report:axe`                                                                                                         | Generated `docs/axe-scan-results.md` from the executed JSON artifact.    |
| `pnpm exec vitest run tools/audit-recipe-dual-emission.test.ts tools/audit-umbrella-purity.test.ts tools/axe-results.test.ts` | 16 passing negative-fixture and artifact-validation tests.               |
| `pnpm run audit:recipe-drift`                                                                                                 | Passed.                                                                  |
| `pnpm run audit:umbrella-purity`                                                                                              | Passed.                                                                  |
| `pnpm run gate:phase1`                                                                                                        | 197 passed, 0 failed.                                                    |

## Out of scope

- The C11 built-but-unpublished primitive backlog.
- RangeCalendar and other second-wave components (Phase 2 / C5).
- Beta accessibility certification and NVDA/JAWS/TalkBack records (Phase 4).
- Signed beta catalogs and channel promotion (Phase 3 / C10).
- Phase 3A compile-time incubation and Phase 3B authoring generators.
- Solid 2 GA and stable v1/v2 release work.

## Phase 1 definition of done

- [x] Every ESLint rule named by Tasks 28 and 41 exists, is registered, and is tested.
- [x] Anatomy, accessible-name, and forbidden-prop violations are caught with positive and negative fixtures.
- [x] Every public primitive is scanned by axe from executable code, and the CI configuration blocks a11y regressions.
- [x] A recipe drift check fails on divergence and is wired into the gate.
- [x] The umbrella package is proven pure and surface-complete.
- [x] The Phase 1 gate enforces all Phase 1 primitives and every new verification artifact.
- [~] The hardened gate passes from a clean checkout with the full repository validation suite.
- [~] Evidence is tied to a committed SHA and a successful CI run.
- [x] `solidiom-implementation-plan.md` reflects the local, pre-CI result.
