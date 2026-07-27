---
id: phase1-acceptance-evidence
title: "Phase 1 Acceptance Evidence"
doc_type: reference
audience: "Solidiom maintainers, platform engineers, accessibility reviewers"
tags: [solidiom, phase-1, evidence, accessibility, ci]
---

> **Status: local pre-CI evidence.** This record does not declare the Phase 1 exit. The implementation changes described here were executed from a dirty worktree and must be committed and verified by hosted CI before the final criterion is satisfied.

## Scope

This evidence covers the remediation plan in `docs/phase-1-tasks.md`: executable axe results, truthful report generation, negative fixtures for recipe and umbrella audits, gate execution, and CI wiring.

- Local execution date: 2026-07-26
- Solid 2 compatibility window: `2.0.0-beta.22` through `2.0.0-beta.24` (local validation ran on `beta.24`)
- Repository HEAD before these uncommitted changes: `b5dc9c0d5590976059e4e3fcbeeddb11e1b30c47`
- Commit containing this evidence: **pending**
- Hosted CI run URL: **pending**

The base `HEAD` above is provenance for the starting worktree only. It is not evidence for the uncommitted implementation.

## Executed results

| Verification                         | Command                                                                                                                       | Result                                                                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Cross-browser component matrix       | `pnpm test:browser`                                                                                                           | 99 test files and 858 tests passed across Chromium, Firefox, and WebKit.                                                      |
| Workspace typecheck                  | `pnpm typecheck`                                                                                                              | Passed for 74 projects and 40 dependent tasks.                                                                                |
| Chromium axe suite                   | `pnpm run test:a11y`                                                                                                          | 40 tests passed. The suite emitted one structured result for each of the exact 39 public primitives; all had zero violations. |
| Artifact-derived report              | `pnpm run report:axe`                                                                                                         | Passed. Regenerated `docs/axe-scan-results.md` from `artifacts/axe-results.json`.                                             |
| Audit and artifact negative fixtures | `pnpm exec vitest run tools/audit-recipe-dual-emission.test.ts tools/audit-umbrella-purity.test.ts tools/axe-results.test.ts` | 16 tests passed.                                                                                                              |
| Recipe drift audit                   | `pnpm run audit:recipe-drift`                                                                                                 | Passed.                                                                                                                       |
| Umbrella purity audit                | `pnpm run audit:umbrella-purity`                                                                                              | Passed.                                                                                                                       |
| Phase 1 gate                         | `pnpm run gate:phase1`                                                                                                        | 197 checks passed, 0 failed. The gate reruns the a11y suite/report and audit fixtures.                                        |

## Evidence mechanics

`tools/run-a11y.ts` removes any previous `artifacts/axe-results.json`, launches the dedicated Chromium Vitest configuration, parses the browser suite's structured console records, validates exact coverage and zero violations, and writes the artifact only after the browser command succeeds. A failed scan therefore cannot leave stale pass evidence for the report or gate.

`tools/generate-axe-report.ts` validates the artifact and requires a 40-character commit SHA before writing the Markdown report. In CI it receives the tested SHA and run URL from GitHub Actions; locally the report labels itself as local execution rather than CI evidence.

The `a11y-axe-scan` job in `.github/workflows/ci.yml` runs the executable scan before report generation and uploads the raw JSON plus Markdown only after both succeed. The `phase1-gate` CI job depends on the a11y job, installs Chromium, and executes `pnpm run gate:phase1`.

## Required post-commit update

After committing this change set and obtaining a green CI run:

1. Replace the pending commit marker with the commit SHA.
2. Replace the pending CI marker with the GitHub Actions run URL.
3. Confirm the artifact uploaded by `a11y-axe-scan` corresponds to that commit.
4. Re-run the clean-checkout validation list in `docs/phase-1-tasks.md` and record any failures.
5. Only then mark the Phase 1 exit as complete in the roadmap.
