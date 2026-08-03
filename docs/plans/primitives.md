---
id: primitives
title: "Solidiom Primitives — Completion Plan"
sidebar_label: Primitives Plan
description: Sequenced plan to close the ten open evidence defects and complete all 52 primitives against a machine-checkable Definition of Done.
doc_type: reference
audience: "Solidiom project leads, contributors, QA"
tags: [primitives, catalog, M4, gates, definition-of-done]
lifecycle: active
date: 2026-08-02
---

## 1. Scope and authority

This document covers two bodies of work: the ten open defects in `docs/plans/website-tasks.md` §11.1, and the completion of `PRIM-001`..`PRIM-052`.

It owns **the bar and the sequence**. It does not own status. `docs/plans/website-tasks.md` §9.1 remains the single place a primitive's row state is recorded, and §11 remains the progress rollup — this document deliberately keeps no parallel status table, because a second copy of 52 rows would drift from the first, which is the failure §11 documents three times over.

Components, blocks, and templates are out of scope except where a primitive gates them.

## 2. Decision register

Fifteen decisions were settled before planning. They are recorded here because the plan is unreadable without them, and because a later reader needs to know what was chosen over what.

| #   | Decision                                                                                                | Rejected alternatives                                                             |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | §8.1 splits into a machine-checkable M4 bar and a human GA bar at G5                                    | Working to §8.1 verbatim; English-only for M4                                     |
| 2   | Required core sections plus conditional sections satisfiable by declared non-applicability              | All nine sections mandatory; freezing the shipped five-section shape              |
| 3   | Spanish authored alongside English, `translationStatus: draft`, real source hash                        | Mechanical generation; English-first with Spanish as a later pass                 |
| 4   | Six blocking defects first, then primitives; four independent defects in parallel                       | All ten defects first; primitives first                                           |
| 5   | `PRIM-000` is source-derived, reconciles against the committed registry, and asserts a ratcheting count | Registry-derived only; source-derived only                                        |
| 6   | Per-package `evidence.json` is committed                                                                | Moving the axe scan into `build`; removing accessibility fields from the registry |
| 7   | Retrofit 14, then 14 component-blocking, then the remaining 24                                          | By registry category; by complexity tier                                          |
| 8   | Runnable examples required where the a11y contract declares keyboard interaction                        | Runnable for all 52; static code for all 52                                       |
| 9   | Registry `status: stable` granted per primitive as its human review lands                               | All 52 promoted at G5; promoted at the M4 bar                                     |
| 10  | One primitive per commit, each reviewed                                                                 | Batched by phase with sampling; one delivery per phase                            |
| 11  | Visual suite runs in the pinned Playwright Linux container                                              | Observe CI and stop there; add a pixel-difference tolerance                       |
| 12  | `BUILD-001` guards `registry/`, `packages/*/source/`, and evidence files                                | Guarding all build output; untracking `packages/*/dist`                           |
| 13  | Out-of-range component IDs move to `proposedComponents`, resolved at work-package split                 | Remapping onto the approved 21; extending the component catalog now               |
| 14  | Typeset and prose become canonical recipe contract scopes                                               | Hand-porting to UnoCSS; declaring the exclusion                                   |
| 15  | A fluent Spanish reviewer is sourced now; contributor review supplements rather than replaces           | Deferring all review to G5; contributor review as the mechanism                   |

## 3. The M4 bar

A `PRIM-*` row may go `[x]` when all nine hold. `PRIM-000` checks every one of them.

| #   | Requirement                                                                                                                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Registry records `documentation.status: "complete"` and `accessibility.reviewStatus: "automated"` with at least one evidence ID, carries bilingual search keywords and current integrity data, **and the committed registry matches source truth** |
| 2   | English overview contains the required sections: Usage, Installation, Parts & Props, Styling, SSR and hydration, Keyboard & behavior                                                                                                               |
| 3   | Conditional sections are present or declared `notApplicable` with a stated reason: Composition, Relationships, Migration notes, Testing                                                                                                            |
| 4   | Spanish mirrors requirements 2 and 3, carries `translationStatus: draft` and a real `translationSourceHash`, and passes the glossary and protected-literal checks in `translation:check`                                                           |
| 5   | At least one example. `runnable: true` with a live Solid island **if and only if** the accessibility contract declares keyboard interaction; otherwise `runnable: false` with a declared reason                                                    |
| 6   | Authored accessibility contract in English and Spanish, per the `A11Y-002` schema                                                                                                                                                                  |
| 7   | Committed `packages/<name>/docs/accessibility/evidence.json` with a passing summary and `passes > 0`                                                                                                                                               |
| 8   | API artifact present and source-linked; all four routes render in both locales                                                                                                                                                                     |
| 9   | Registry `status` remains `preview`                                                                                                                                                                                                                |

Requirement 5's discriminator is deliberately derived rather than listed. Tying it to the accessibility contract's keyboard section means the rule reads off an authored artifact that already exists per primitive, so no separate list can drift and no case is argued individually.

### 3.1 The G5 bar

Per primitive, in order: Spanish flips to `translationStatus: human-reviewed`, then registry `status` moves to `stable`. That second step arms two existing gates for that primitive automatically — `a11y:coverage-gate` enforces only where status is `stable`, and `validate-translation-freshness.ts` derives GA maturity from the same field and then blocks on anything not human-reviewed. No new enforcement is needed at G5; promotion _is_ the enforcement.

## 4. Phase 0 — amend the tracker

One commit, before any work is measured against the new bar.

- §8.1 split into the M4 and G5 tiers of §3 above.
- §1.2's conditional-section rule and the `notApplicable` mechanism recorded.
- §8.5 referenced from the G5 tier rather than the M4 tier.
- Requirement 5's runnable discriminator recorded.
- §9.2 notes that `COMP-018` (Sheet) is referenced by no block in the approved manifest.
- §9.3 records the `proposedComponents` decision.
- G4's exit checklist gains the `PRIM-000` count assertion; G5's gains per-primitive promotion.
- **`TEST-005` corrected.** Its row, the M1 rollup row, and its limitations entry all state the 36 baselines are stale. They are not. Local renders of the docs, homepage, and 404 captures are byte-identical to the pre-`TEST-005` baselines, so nothing about the site's rendering changed across the intervening commits; the 36/36 failure is a macOS-versus-Linux platform difference. The honest status is unverifiable locally, pending a `site-visual` run that has never happened.

## 5. Phase 1 — unblock

Roughly six commits. The ordering is forced: nothing later is trustworthy until a CI run has been observed.

| Order | Task        | Work                                                                                                                                                                                                                     |
| ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | `CI-006`    | `pnpm format`, and fix `scripts/generate-at-records.js` so AT records emit prettier-clean rather than reformatting 52 generated files by hand                                                                            |
| 2     | `CI-005`    | Push and observe a full run. Blocks on a human — Actions results are not readable from here                                                                                                                              |
| 3     | `A11Y-009`  | Run `report:a11y-evidence`, commit 14 evidence files, resolve Visually Hidden's `passes: 0` scan, run `registry:build`, commit 53 registry files                                                                         |
| 4     | `BUILD-001` | Scoped `git diff --exit-code` over `registry/`, `packages/*/source/`, and evidence files. Commit the 20 stale `dist` files and `packages/unocss-preset/source/generated-theme-preflights.ts` as one-off cleanup          |
| 5     | `PRIM-000`  | `tools/primitive-catalog-gate.ts` plus fixtures. Runs inside `a11y-axe-scan`, the only job that sees both committed and freshly generated evidence. Asserts that its count equals the number `website-tasks.md` declares |
| 6     | `VS-005`    | Replace the vertical-slice gate's §11 text regex with a delegation to `PRIM-000`'s count                                                                                                                                 |

The containerised visual harness from decision 11 also lands here. It is independent of catalog work and makes local visual runs meaningful, which is the precondition for anyone ever approving a baseline.

## 6. Phases 2 to 4 — the 52 primitives

Fifty-two commits, one primitive each, each individually reviewed.

**Phase 2 — retrofit the 14 that already have pages.** Button first: it is component-blocking, already carries six sections, and its contract declares keyboard interaction, so it exercises the runnable rule end to end on the first commit. Then the remaining ten M4 primitives. Dialog, Combobox, and Data Table last — they sit at two sections each and need the most prose, notwithstanding that they are already runnable.

**Phase 3 — the 14 that gate the component queue.** Input, Field, Select, Menu, Tabs, Toast, Tooltip, Checkbox, Radio Group, Switch, Popover, Sheet, Navigation Menu, Pagination. Completing these makes all 21 `COMP-*` rows startable, and components gate blocks, which gate templates.

**Phase 4 — the remaining 24.** Alert Dialog, Calendar, Carousel, Collapsible, Command Palette, Context Menu, Date Picker, Drawer, Empty State, Hover Card, Input OTP, Listbox, Meter, Progress, Resizable Panels, Scroll Area, Skeleton, Slider, Spinner, Toggle, Toggle Group, Toolbar, Tree, Virtual List.

### 6.1 Per-primitive commit contents

- English overview: six required sections, plus conditional sections or declared non-applicability.
- Spanish overview: same structure, `translationStatus: draft`, real `translationSourceHash`.
- Example in both languages, plus a Solid island under `apps/site/src/components/` where requirement 5 demands runnable.
- Accessibility contract in both languages.
- Committed `evidence.json`.
- Regenerated registry entry.
- The declared count in `docs/plans/website-tasks.md` incremented **in the same commit**. A ratchet updated separately is a ratchet that drifts.

### 6.2 Per-commit verification

```sh
pnpm run primitive:catalog-gate                       # PRIM-000: bar + reconciliation + count
pnpm --filter @solidiom/site run translation:check    # hash freshness, glossary, protected literals
pnpm run audit:package-source-parity
pnpm --filter @solidiom/site check
pnpm --filter @solidiom/site build
```

## 7. Phase 5 — independent work and G5 preparation

`RECIPE-007` may land at any time: declare typeset and prose in `tools/recipe-contract-definitions.ts`, emit all three profiles, and extend `tests/recipe-parity/` to cover the new scopes so the migration is proven free of behaviour drift. `BLOCK-000A` is likewise independent. `CI-007` follows the observed run from Phase 1. Visual baseline approval happens in the container after the last primitive lands, not before — 38 new pages will change `/primitives/`, one of the three captured routes. Per-primitive `stable` promotions begin as reviews arrive.

## 8. Dependencies outside this plan

1. **Push authorisation and CI observation.** Phase 1 step 2 blocks on it, and every enforcement claim downstream is unverified until a run is seen.
2. **Docker**, for the pinned Playwright image.
3. **A fluent Spanish reviewer.** Not blocking M4 — primitives close at `preview` with `draft` Spanish — but the earlier they start, the more incremental G5 becomes.
4. **Fifty-two review cycles.** `PRIM-000` does the mechanical checking, so each report is a gate count, the judgements made rather than derived, and the files worth sampling. This is the plan's binding schedule constraint.
5. **A wording decision on `BETA-001`'s maturity labels.** Fully documented primitives display `preview` until review lands, and `docs/contracts/beta-coverage-matrix.md` should explain that rather than let it read as understatement.

## 9. Known risks

**Visually Hidden's accessibility evidence asserts nothing.** Its axe scan records `passes: 0, violations: 0, outcome: "pass"`, which `registry-build.ts` correctly refuses as evidence while every other consumer reads as a pass. Requirement 7 fails for it until the scan is given something to check. Likely the only primitive needing a bespoke fix.

**`dist` determinism on Linux is unproven.** Repeated builds are byte-stable here, but CI runs Node 24 and 26 on Linux and `tsup` output can vary by toolchain. Decision 12 scoped the guard away from `dist` for that reason; tightening it once a few runs show stability is cheap.

**Two of §8.1's original clauses were unsatisfiable by construction**, which is worth remembering when the bar is next revised. "Visual checks pass" had no per-primitive harness to pass, and human-reviewed Spanish was enforced by nothing below GA status. A requirement no check can evaluate is indistinguishable from an absent one.
