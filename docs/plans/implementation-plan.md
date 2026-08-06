---
id: opencenter-solidiom-implementation-plan
title: "openCenter Solidiom Library and Release Roadmap"
sidebar_label: Library Roadmap
description: Authoritative active roadmap for the Solidiom library from beta through Solid 2 GA, v1, and strict v2.
doc_type: plan
audience: "Solidiom project leads, platform engineers, contributors"
tags: [solidiom, implementation, library, release, roadmap]
version: "8.0"
paired_design: opencenter-solidiom-v0.6
lifecycle: active
authority: authoritative
volatility: high
---

# Solidiom library and release roadmap

> **Authority:** This is the status authority for the active **library and release** roadmap. Website milestones G0–G5 are independent and are tracked in [`website-tasks.md`](./website-tasks.md). `apps/site` is the authoritative documentation and website application; references to `apps/docs` in the [Phase 0–2 archive](../history/plans/library-phases-0-2.md) are historical only.

The paired design document defines what and why; this plan defines active sequencing, release gates, and acceptance evidence. Completed Phase 0–2 task rows and the former dense change log are archived in [`library-phases-0-2.md`](../history/plans/library-phases-0-2.md). Status convention: `[ ]` open, `[~]` in progress, `[x]` complete, `[-]` descoped, `[!]` blocked.

## Release model and locked decisions

- Initial `v1.0.0-beta.x` remains on Solid 2 beta. Continuous candidates use `next`; only a candidate passing the final Phase 3 gate is promoted to `beta`.
- Phase 3A compile-time work does not block the initial beta, but must finish before the first `1.0.0-rc.x` and become stable before v1.
- Phase 3B generative authoring tooling is an independent, unversioned repository milestone; it does not gate v1 or v2 unless this plan is revised explicitly.
- Phase 4 starts after Solid 2 GA and ends with stable v1 on `latest`. Phase 5 is a separate breaking-release program for strict defaults and completed sunsets.
- Runtime/package architecture remains Nx + pnpm + Changesets, dual `dist/`/`source/` emission, Vitest browser mode, package/source parity, framework-neutral adapters, and deterministic test doubles.
- Distribution remains npm tarballs plus signed immutable Cloudflare R2 catalogs and signed mutable `next`/`beta`/`latest` pointers. The CLI verifies provenance and policy before mutation.
- Canonical recipes produce CSS, Tailwind, and UnoCSS outputs. Compile-time transforms must preserve no-transform behavior.
- Public docs, demos, evidence, and release notes belong in `apps/site`; the website program owns its own completion status.

## Phase and version map

| Phase                            | Version/milestone              | Exit                                    |
| -------------------------------- | ------------------------------ | --------------------------------------- |
| 0 — architectural proof          | v0.6.x                         | Task 27 — complete                      |
| 1 — primitive/package alpha      | v0.7.x–v0.8.x                  | Task 42 — complete                      |
| 2 — distribution/enterprise beta | v0.9.x–v0.10.x                 | Task 58 — complete                      |
| 3 — beta stabilization/release   | `v1.0.0-beta.x`                | Task 60 gate; Task 68 release           |
| 3A — compile-time incubation     | later `v1.0.0-beta.x`          | Task 67; required before first RC       |
| 3B — generative authoring        | unversioned internal milestone | Task 3B.8; independent of release gates |
| 4 — Solid 2 GA/stable v1         | `v1.0.x`                       | Task 70 gate; Task 73 release           |
| 5 — strict enforcement/stable v2 | `v2.0.x`                       | Task 78                                 |

## Initial-beta blockers

Numbered tasks are the status of record when a C-item shadows one. Completed reconciliation and RangeCalendar work remain recorded in the archive; the open release boundary is:

- [ ] **C8 — beta accessibility evidence.** Automated axe and keyboard evidence plus VoiceOver records must cover every public beta primitive and separately tracked component. The public beta surface now includes all 52 primitives and 30 verified components. NVDA, JAWS, and TalkBack gaps remain explicit Phase 4 work. **Accept:** current evidence files enumerate the complete beta surface and link durable runs/artifacts.
- [~] **C9 / Task 60 — preflight versus final acceptance.** `tools/phase3-preflight.ts` and its package script now exist; Task 60 remains in progress until `tools/phase3-gate.ts` is demonstrably the final release approval over all blockers and candidate artifacts. **Accept:** preflight stays green while negative fixtures prove the final gate rejects each missing release requirement.
- [ ] **C10 / Task 68 — signed beta artifacts.** Publish the approved npm set, `apps/site`, immutable catalog, and signed beta pointer only after the final gate passes. **Accept:** clean package- and source-mode consumers verify tarballs, catalog, and pointer signatures.
- [ ] **C11 — public-package classification.** Resolve every package covered by the original publishable-but-untracked backlog as promoted or explicitly non-public. **Accept:** no publishable primitive package sits outside both the public catalog/evidence set and the explicit non-public set.

Release accountability is still unresolved: no repository `CODEOWNERS` exists and all DRIs below remain `TBD`. A final gate cannot be signed off until the beta-blocking rows have named owners and durable evidence.

| Work            | DRI | Owner area            | Depends on               | Required evidence                                          |
| --------------- | --- | --------------------- | ------------------------ | ---------------------------------------------------------- |
| C8              | TBD | Accessibility         | public beta surface      | axe, keyboard, VoiceOver artifacts                         |
| C9 / Task 60    | TBD | Release engineering   | blocker criteria         | preflight plus final-gate positive/negative fixtures       |
| C10 / Task 68   | TBD | Release engineering   | C8, C9, Tasks 61/65      | signed candidate, consumers, promoted pointer              |
| C11             | TBD | Primitives/release    | classification decisions | catalog evidence or explicit publish exclusion             |
| Tasks 62–67     | TBD | Build tooling         | initial beta             | transform parity, benchmarks, Phase 3A gate                |
| Tasks 3B.1–3B.8 | TBD | Developer experience  | manifest contract        | deterministic sync, audits, temporary-workspace round trip |
| Tasks 69–76     | TBD | Platform/release/a11y | Solid 2 GA               | GA matrix, external audit, policy, RC evidence             |
| Tasks 77–78     | TBD | Platform/release      | v1 sunset criteria       | strict fixtures, migration guidance, signed v2 release     |

## Active numbered tasks

### Phase 3 — initial beta

- [x] **Task 59 — repository truth reconciliation.** Registry, package, demo, and task-surface discrepancies were recorded; follow-up classification remains C11.
- [~] **Task 60 — Phase 3 preflight and final release gate.** Keep `gate:phase3-preflight` as the Solid 2 beta baseline and make `gate:phase3` the final blocker/candidate approval. **Accept:** every omitted artifact has a failing fixture; promotion is impossible before a green final gate.
- [ ] **Task 61 — beta release notes and docs.** In `apps/site`, state Solid 2 beta support, known limitations, maturity, and evidence links. **Accept:** install, accessibility, public API, and release pages agree on channel and scope.
- [ ] **Task 65 — cross-browser beta certification.** Run every public primitive and tracked component in Chromium, Firefox, and WebKit. **Accept:** all skips are documented and issue-linked.
- [-] **Task 66 — legacy and migration beta readiness.** Descoped because the product is greenfield and has no prior released legacy surface.
- [ ] **Task 68 — initial beta release.** Promote a gate-approved `next` candidate to `beta`; publish npm, `apps/site`, immutable R2 catalog, and signed channel pointer. **Accept:** fresh package/source consumers and signature checks pass.

### Phase 3A — compile-time beta incubation

- [~] **Task 62 — static recipe extraction beta.** Opt-in only; record independent transform/no-transform behavior and bundle deltas.
- [~] **Task 63 — static variant expansion beta.** Prove static/dynamic parity and preserve the documented fallback.
- [~] **Task 64 — dead-part elimination beta.** Remove only statically unreachable optional parts; cover Dialog, Menu, Tooltip, Popover, and Drawer.
- [~] **Task 67 — unused-capability detection and Phase 3A gate.** Add machine-readable strict-capability diagnostics and a gate over Tasks 62–64/67.

### Phase 3B — generative authoring tooling

Package-local `primitive.json` manifests own package facts; authored behavior, tests, and demos remain human-owned. Generated indexes are outputs, never inputs. Commands must plan, validate, and apply atomically; `--check` and `--dry-run` never mutate.

- [ ] **Task 3B.1 — versioned primitive contract and manifest migration.** Typed schema, stable diagnostics, reviewed manifests, and removal of parallel completion policy.
- [ ] **Task 3B.2 — internal generator core.** `pnpm scaffold primitive`; safe names, collision protection, starter anatomy/tests, atomic writes.
- [ ] **Task 3B.3 — generated package and aggregator wiring.** Deterministic umbrella, registry, recipe, and `apps/site` registration output with zero-diff regeneration.
- [ ] **Task 3B.4 — complete recipe scaffolding.** CSS, Tailwind, and UnoCSS starter output and wiring pass recipe audits.
- [ ] **Task 3B.5 — authored demo starter plus generated registration.** Create absent demo starters once; generate `apps/site` registration/routes without overwriting authored files.
- [ ] **Task 3B.6 — idempotent sync/fixer mode.** Second sync is a no-op; failed validation leaves the workspace unchanged.
- [ ] **Task 3B.7 — independent CI drift gate.** Golden failures, real builds, and a throwaway fixture workspace catch shared generator/gate defects.
- [ ] **Task 3B.8 — retire copy-paste authoring.** Update contributor guidance around manifests, scaffolding, audits, and ownership; no `cp -r` workflow.

### Phase 4 — Solid 2 GA and stable v1

- [ ] **Task 69 — Solid 2 GA transition.** Stable peers, no prerelease pins, simplified supported matrix, no beta workarounds.
- [ ] **Task 71 — external accessibility audit and full AT records.** Publish remediation and VoiceOver/NVDA/JAWS/TalkBack records for the complete public surface.
- [ ] **Task 74 — compile-time optimizations GA.** Promote Tasks 62–64/67 with stable docs, fallbacks, diagnostics, and independent parity evidence.
- [ ] **Task 75 — legacy sunset schedule.** Assign GA-based dates and removal migrations before the first RC.
- [ ] **Task 76 — v1.x maintenance policy.** Publish supported Solid/browser ranges, security policy, cadence, and deprecation rules.
- [ ] **Task 70 — stable v1 acceptance gate.** Assert GA peers, audit/AT matrix, browser support, compile-time stability, policy, signatures, SBOM, parity, and candidate evidence.
- [ ] **Task 72 — release candidate hardening.** Publish at least one RC and freeze the public API; run package/source, transform, site, SSR, visual, a11y, browser, SBOM, signature, and policy checks.
- [ ] **Task 73 — v1 stable release.** Publish `latest`, `apps/site`, immutable catalog, and signed latest pointer; rerun the stable gate after publication.

### Phase 5 — strict enforcement and stable v2

- [ ] **Task 77 — v2 strict enforcement.** Complete sunsets, enable planned strict defaults, and provide actionable migration failures.
- [ ] **Task 78 — v2 stable release.** Rerun shared v1 regressions plus v2-specific removal/strict criteria; publish signed npm/R2 artifacts and announcement.

## Current validation entry points

These commands are present in the root `package.json`; run targeted gates first and inspect `git status` because some gates/generators may update tracked artifacts.

```sh
pnpm run gate:phase0
pnpm run gate:phase1
pnpm run gate:phase2
pnpm run gate:phase3-preflight
pnpm run gate:phase3
pnpm run typecheck
pnpm run build
pnpm run test
pnpm run test:browser
pnpm run test:a11y
pnpm run beta:acceptance:report
pnpm run beta:acceptance:e2e
```

`tools/phase4-gate.ts` exists but has no root script; until one is added, its direct entry point is `pnpm exec tsx tools/phase4-gate.ts`. Phase 3A and 3B gates are planned tasks, not current commands. Website validation and G0–G5 status remain in [`website-tasks.md`](./website-tasks.md).
