---
id: phase1-acceptance-evidence
title: "Phase 1 Acceptance Evidence"
doc_type: reference
audience: "Solidiom maintainers, platform engineers, accessibility reviewers"
tags: [solidiom, phase-1, evidence, accessibility, ci]
---

> **Status: Phase 1 exit confirmed.** All acceptance criteria are satisfied and backed by a successful hosted CI run.

## Scope

This evidence covers the remediation plan in `docs/phase-1-tasks.md`: executable axe results, truthful report generation, negative fixtures for recipe and umbrella audits, gate execution, and CI wiring.

- Local execution date: 2026-07-26
- CI verification date: 2026-07-27
- Solid 2 compatibility window: `2.0.0-beta.22` through `2.0.0-beta.24` (local validation ran on `beta.24`)
- Commit: `ea7eb62a8845ef296ec4cdb8f06a763c4a87d017`
- Hosted CI run: `https://github.com/solidiom/core/actions/runs/30264007788` (15/15 jobs passed)

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

## Post-commit verification (complete)

1. ✅ Commit SHA: `ea7eb62a8845ef296ec4cdb8f06a763c4a87d017`
2. ✅ CI run URL: `https://github.com/solidiom/core/actions/runs/30264007788`
3. ✅ All 15 CI jobs passed including `phase1-gate`, `a11y-axe-scan`, `test-browser`, `test-node`, and `test-solid-matrix`.
4. ✅ The `a11y-axe-scan` job executed the scan, generated the report, and uploaded the artifact for the verified commit.
5. ✅ Phase 1 exit declared.
