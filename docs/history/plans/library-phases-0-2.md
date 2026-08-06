---
id: library-phases-0-2-history
title: "Solidiom Library Roadmap History — Phases 0–2"
description: Archived completed task ledger and roadmap revision history formerly embedded in the active implementation plan.
doc_type: history
audience: "Solidiom maintainers and contributors researching prior implementation decisions"
tags: [solidiom, history, roadmap, phases]
lifecycle: archived
authority: non-authoritative
volatility: low
---

# Solidiom library roadmap history — Phases 0–2

> **Historical, non-authoritative context.** This archive preserves completed Phase 0–2 row-level detail and the former dense change log. It must not be used for current status, paths, commands, application ownership, or release decisions. See the authoritative active [`implementation-plan.md`](../../plans/implementation-plan.md). In particular, `apps/site` is now authoritative; historical `apps/docs` references below describe the repository at the time.

Status symbols retain their historical meaning: `[x]` complete and `[-]` descoped. Evidence counts and version pins are snapshots, not current expected results.

## Phase 0 — architectural proof (v0.6.x)

| Status | Task                               | Historical delivery and verification                                                                                                                                                                          |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | 1 — workspace and CI               | Nx integrated workspace, pnpm, Changesets, layer tags, CI/release skeleton, MIT-era license record, and `gate:phase0`; boundary fixtures and Changesets status verified.                                      |
| [x]    | 2 — build presets                  | tsup for pure TS, Vite/vite-plugin-solid for JSX, compiled `dist/`, canonical `source/`, Solid export condition, and probe consumers.                                                                         |
| [x]    | 3 — browser tests                  | Vitest browser mode with Playwright provider, node config, type tests, workspace discovery, and failure artifacts; later evidence recorded an 858-test three-browser pass.                                    |
| [x]    | 4 — Solid 2 beta matrix            | Rolling low/mid/high beta window, catalog/override control, Node 24/26 × Chromium CI matrix, and deterministic update scripts.                                                                                |
| [x]    | 5 — runtime state/events/DOM       | Controllable/disclosure state, change details, composed handlers/refs, stable IDs, cleanup, and element observers with transition/SSR tests.                                                                  |
| [x]    | 6 — collections/navigation         | Collection identity, composite navigation, roving focus, typeahead, RTL/orientation, IME, and dynamic-item tests.                                                                                             |
| [x]    | 7 — overlays/presence              | Document-scoped layer stack, dismissal, focus scope, modal isolation, portal, scroll lock, and presence lifecycle with nested-overlay tests.                                                                  |
| [x]    | 8 — forms/i18n                     | Form-control wiring, hidden inputs, validation, direction, locale, reset, and native-form participation.                                                                                                      |
| [x]    | 9 — semantic attributes/boundaries | Semantic vocabulary, `applySemanticAttrs`, and initial ESLint rules preventing layer/engine/adapter output violations.                                                                                        |
| [x]    | 10 — deterministic doubles         | Framework-neutral positioning, virtualization, date, carousel, and table-model doubles with type and deterministic-output tests.                                                                              |
| [x]    | 11 — benchmark harness             | Playwright interaction traces, mitata throughput, size-limit bundle checks, JSON report output, and probe baseline.                                                                                           |
| [x]    | 12 — Dialog hard slice             | Compound Dialog, controlled/uncontrolled open state, reasoned changes, focus/modal/presence/portal/scroll behavior, SSR safety, and layered conformance.                                                      |
| [x]    | 13 — package-mode proof            | Packed Dialog/runtime artifacts with `dist/` and `source/`, isolated consumer proof, and package/source behavior comparison.                                                                                  |
| [x]    | 14 — Floating UI adapter           | `PositioningCapability@1`, capability/side-effect conformance, framework-neutral output, and deterministic-double parity.                                                                                     |
| [x]    | 15 — Select hard slice             | Single/multiple selection, collection/typeahead, form participation, positioning port, focus restoration, dismissal, and state attributes.                                                                    |
| [x]    | 16 — date adapter/Calendar         | Primitive-representable public date values, calendar grid/navigation/selection/RTL/disabled-date behavior, and no engine types in public API.                                                                 |
| [x]    | 17 — carousel adapter/primitive    | First-party state, controls/live region, capability-backed physics, keyboard/a11y behavior, and frame-stability benchmark.                                                                                    |
| [x]    | 18 — second positioner             | Minimal adapter passed the same conformance and Select swap-invariance checks as Floating UI.                                                                                                                 |
| [x]    | 19 — CLI skeleton                  | clipanion-based `init`, `plan`, and package-mode `add`, deterministic JSON plans, policy/config schemas, and contributor prompts.                                                                             |
| [x]    | 20 — static registry               | Manifest schema, deterministic index generation, tarball metadata, and initial static catalog consumption.                                                                                                    |
| [x]    | 21 — source materialization        | Dialog/Select source install, shared runtime deduplication, import rewriting, lockfile updates, and golden parity tests.                                                                                      |
| [x]    | 22 — package/source parity         | Behavioral/export/type parity for Dialog, Select, Calendar, and Carousel; negative fixtures proved divergence detection.                                                                                      |
| [x]    | 23 — provenance/inspect            | Lockfile round trip and `inspect source`, `inspect manifest`, `inspect explain`, `inspect files`, and `inspect provenance`; legacy aliases warned.                                                            |
| [x]    | 24 — diff/detach                   | Digest-aware local/upstream diff and non-destructive detach behavior.                                                                                                                                         |
| [x]    | 25 — three-way update              | Base/local/remote resolution, transformations, diff3, AST/CSS validation, atomic writes, patch fallback, and dry-run safety.                                                                                  |
| [x]    | 26 — migration/facade proof        | One shadcn-solid Dialog transform and isolated legacy facade with idempotence, diagnostics, sunset metadata, and boundary rules.                                                                              |
| [x]    | 27 — Phase 0 gate                  | Mechanical exit gate for architecture, parity, adapters, SSR, update, migration/facade isolation, browsers, Solid matrix, CI, and Changesets; final archived evidence recorded 52 checks at commit `9e524af`. |

## Phase 1 — primitive and package alpha (v0.7.x–v0.8.x)

| Status | Task                         | Historical delivery and verification                                                                                                                                    |
| ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | 28 — ESLint plugin           | Nine boundary/anatomy rules ultimately registered with 70 tests, including independently named `no-adapter-import-of-recipes`.                                          |
| [x]    | 29 — basic semantics         | Button, Label, VisuallyHidden, Separator, Progress, and Meter with layered conformance, axe coverage, and demos.                                                        |
| [x]    | 30 — Field                   | Composition contract for label/description/error/required/invalid wiring; thin TextField/TextArea/NumberField/FileField wrappers were intentionally descoped.           |
| [x]    | 31 — selection               | Checkbox, Radio Group, Switch, Toggle, Toggle Group, and single/range Slider with keyboard, RTL, indeterminate, pressed, and stepping behavior.                         |
| [x]    | 32 — disclosure/navigation   | Collapsible, Accordion, Tabs, and Pagination over shared disclosure foundations with keyboard, presence, and focus tests.                                               |
| [x]    | 33 — overlays                | Popover, Tooltip, and Menu using the positioner port; nested dismissal, submenu/typeahead, and pointer-intent behavior.                                                 |
| [x]    | 34 — collections             | Listbox and Combobox with collection invariants and async/in-memory filtering demonstrations.                                                                           |
| [x]    | 35 — feedback                | Toast and Alert; Toast included document-scoped stacking, live-region behavior, dismissal, and non-stealing focus.                                                      |
| [x]    | 36 — CSS recipes             | Historically separately authored CSS/TSX dual emission with scope/part audit and negative divergence fixtures; later superseded by the canonical recipe contract.       |
| [x]    | 37 — Tailwind recipes        | Historical Tailwind dual-emission profile under the same audit; later superseded by generated canonical outputs.                                                        |
| [x]    | 38 — doctor/CLI expansion    | Misconfiguration diagnostics, orphan detection, remove command, and machine-readable command output.                                                                    |
| [x]    | 39 — accessibility CI        | Parametrized Chromium axe scans, authored AT template, successful artifact-only report generation, and CI evidence; non-VoiceOver AT remained later scope.              |
| [x]    | 40 — umbrella package        | Pure `@solidiom/primitives` re-exports with exact-surface audit and negative fixtures.                                                                                  |
| [x]    | 41 — anatomy/semantics rules | Required-part, accessible-name, and forbidden-prop checks for eight primitive families with 29 targeted tests.                                                          |
| [x]    | 42 — Phase 1 gate            | Hardened gate covered primitives, browser tests, ESLint, axe artifacts, recipes, and umbrella purity; hosted CI run `30264007788` at commit `ea7eb62` recorded 197/197. |

### Superseded recipe direction

Tasks 36–37 accurately describe the shipped Phase 1 state, but not the target architecture. `RECIPE-001` later established one canonical recipe contract; `RECIPE-002/003/004` generate CSS, Tailwind, and UnoCSS output, turning the old dual-emission check into generated-artifact coverage.

## Phase 2 — distribution and enterprise beta (v0.9.x–v0.10.x)

| Status | Task                               | Historical delivery and verification                                                                                                                                                                                                                |
| ------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | 43 — keyless verification          | Public-artifact verification, cached trust data, identity policy, offline bundles, and machine-readable failures.                                                                                                                                   |
| [x]    | 44 — trusted keys                  | Explicit Ed25519 verification, rotation rules, and historical-versus-new artifact behavior.                                                                                                                                                         |
| [x]    | 45 — release signing               | CI-only release-tools signing for public and enterprise samples, kept out of the runtime CLI bundle.                                                                                                                                                |
| [x]    | 46 — policy engine                 | Full policy schema, version/capability enforcement, and plan-time failure before mutation.                                                                                                                                                          |
| [x]    | 47 — license/SBOM                  | Direct/transitive license inventory and CycloneDX 1.5 JSON output validated against schema.                                                                                                                                                         |
| [x]    | 48 — UnoCSS                        | UnoCSS recipe profile and semantic-state preset variants with DOM-contract parity.                                                                                                                                                                  |
| [-]    | 49 — migration matrix              | Descoped because the product was greenfield with no prior released migration source.                                                                                                                                                                |
| [-]    | 50 — legacy CLI                    | Descoped because no released legacy surface existed.                                                                                                                                                                                                |
| [x]    | 51 — Drawer                        | Dialog/gesture composition with touch dismissal, presence, and focus restoration parity.                                                                                                                                                            |
| [x]    | 52 — Date Picker/RangeCalendar     | Date Picker plus distinct RangeCalendar exports, primitive range values, start/end/restart cycle, semantic range attributes, RTL/disabled-date behavior, 25 unit and 20 browser tests, axe, parity, registry component metadata, and demo.          |
| [x]    | 53 — virtualization                | TanStack Virtual adapter and Virtual List with 10K-item and focus-recovery coverage.                                                                                                                                                                |
| [x]    | 54 — table model                   | TanStack Table adapter and native-semantic Data Table with sorting/filtering and announcements.                                                                                                                                                     |
| [x]    | 55 — second wave                   | Tree, Resizable Panels, and Command Palette with family suites and demonstrations.                                                                                                                                                                  |
| [x]    | 55A — additional public primitives | Badge, NavigationMenu, ScrollArea, and Input OTP were added to the recorded public surface after being omitted from the original task list.                                                                                                         |
| [x]    | 56 — performance dashboard         | Benchmark history rendered in the then-current docs application.                                                                                                                                                                                    |
| [x]    | 57 — offline enterprise install    | Mirror guide and Verdaccio-backed air-gapped installation proof.                                                                                                                                                                                    |
| [x]    | 58 — Phase 2 gate                  | Hardened gate covered signatures, policy, SBOM, three recipe profiles, second-wave components, RangeCalendar, adapter kit/conformance, layer isolation, benchmarks, and offline install; visualizer deferral and greenfield descopes were explicit. |

## Completed beta-reconciliation items formerly mixed into the active plan

- [x] **C1 — executable baseline gates:** dead imports, missing typechecks, signing API mismatch, and the Solid 2 beta baseline were repaired; hosted Phase 1 evidence is recorded above.
- [x] **C2 — Phase 1 primitive status:** the basic semantics/feedback packages, registry, demos, and gate evidence were reconciled.
- [x] **C3 — composed Field APIs:** Field remained the public composition contract; thin wrapper concepts were deferred.
- [x] **C4 — selection API:** Toggle and Toggle Group became standalone public packages and umbrella/catalog entries.
- [x] **C5 — RangeCalendar:** restored to beta scope and completed under Task 52 with component-level evidence inside the Calendar package.
- [x] **C6 — registry coverage:** the then-recorded registry, umbrella, and demo index were reconciled; later catalog expansion is governed elsewhere.
- [x] **C7 — demo coverage:** each public registry primitive then had a demo; RangeCalendar had its own component demo.

## Archived roadmap change log

This log preserves claims as written at each revision. Later entries often correct earlier ones; none is current authority.

- **v0.1 — initial:** created beside design v0.6 with 14 recorded decisions and 68 tasks across Phases 0–3.
- **v0.2 (2026-07-19):** Tasks 1–4 completed: workspace, CI, Changesets, build presets, browser harness, and rolling Solid beta matrix. Declaration output used `tsc --emitDeclarationOnly` because the then-current DTS path was incompatible.
- **v0.3 (2026-07-19):** Task 5 completed with runtime state/events/DOM modules and 49 tests; source emission and duplicate test discovery were repaired.
- **v0.4 (2026-07-19):** Tasks 6–8 completed with collections, overlays, presence, forms, and i18n; 162 runtime tests were recorded.
- **v0.5 (2026-07-19):** Tasks 9–10 completed with semantic attributes, initial ESLint boundaries, deterministic capability doubles, and roughly 258 tests.
- **v0.6 (2026-07-19):** Tasks 11–12 completed with benchmark scaffold and Dialog hard slice; Task 13 packing was in progress and roughly 275 tests were recorded.
- **v1.0 (2026-07-19):** Phase 0 declared complete: four hard slices, adapters, CLI/catalog/source install, migration/facade proof, and initial gate. v7.2 later hardened this to 52 checks.
- **v2.0 (2026-07-19):** Phase 1 was declared mostly complete, with gaps in Tasks 29, 35, and 39; 13 new primitives, recipes, umbrella package, and a 19-check gate were recorded.
- **v3.0 (2026-07-19):** Phase 2 was declared complete with enterprise verification/policy/SBOM, UnoCSS, second-wave primitives/adapters, benchmarks, and offline guidance. Later audits corrected premature details.
- **v4.0 (2026-07-19):** Phase 3 was called mostly complete with 65/68 tasks, acceptance tooling, compile-time optimizations, and cross-browser config; v5.0 superseded this status.
- **v5.0 (2026-07-23):** split beta stabilization from Solid 2 GA/stable v1 and introduced C1–C10 reconciliation work.
- **v6.0 (2026-07-23):** called the beta gate green after baseline repairs and a 35-entry registry reconciliation. Later revisions reclassified this as preflight evidence, restored RangeCalendar, and expanded the public surface.
- **v6.1 (2026-07-26):** introduced Phase 3B generative distribution to replace the manual multi-file primitive-authoring workflow with manifests, scaffold/sync, and drift enforcement.
- **v7.0 (2026-07-26):** separated planned preflight from final beta approval, restored RangeCalendar, moved compile-time work to 3A, made 3B independent, split GA/v1 from strict v2, selected signed R2 catalogs/pointers, and added ownership/evidence requirements.
- **v7.1 (2026-07-26):** reconciled four omitted public primitives, introduced C11 for 13 publishable-but-untracked packages, corrected gate-versus-release mappings, clarified missing preflight implementation at that time, and required durable evidence/named owners.
- **v7.2 (2026-07-26):** reproducibly proved Phase 0 from a clean checkout: restored CI/Changesets, repaired browser mode, updated Solid window, added migration/facade proofs, behavioral parity and consumer proofs, and hardened the gate to 52 checks at `9e524af`.
- **v7.3 (2026-07-26):** reported Phase 1 gap closure for anatomy rules, adapter boundary naming, per-primitive axe scans, recipe drift, umbrella purity, and a 194-check gate; later evidence hardening corrected the exit claim.
- **v7.4 (2026-07-26):** prevented fabricated axe reports by adding an executable scanner and artifact validation, added negative audit fixtures, and recorded a local 197/197 result while explicitly withholding exit pending CI.
- **v7.5 (2026-07-26):** moved the Solid beta window to beta.22–24 and recorded local browser 858/858, 74-project typecheck, axe 40/40, and Phase 1 gate 197/197; still pre-CI.
- **v7.6 (2026-07-27):** Phase 1 exit became CI-backed after JSX parity and browser-install fixes; run `30264007788` at `ea7eb62` passed all 15 jobs and the 197-check gate.
- **v7.7 (2026-07-27):** closed Phase 2 gaps: implemented RangeCalendar, built the adapter authoring kit, explicitly deferred the source graph visualizer, hardened the Phase 2 gate to 63 checks, and added its CI job. The entry also corrected an earlier premature Phase 2-exit claim before final reconciliation.

## Historical traceability summary

| Design area                        | Completed Phase 0–2 tasks |
| ---------------------------------- | ------------------------- |
| Runtime kernel                     | 5–8                       |
| Initial and alpha primitives       | 12, 15–17, 29–35, 55A     |
| Second wave                        | 51–55A                    |
| Adapter architecture               | 10, 14, 16–18, 53–54      |
| Distribution and update            | 13, 19–25                 |
| Security, policy, licenses         | 43–47                     |
| Styling                            | 9, 36–37, 48              |
| Conformance and evidence           | 14, 22, 26, 39, 52        |
| Benchmarks                         | 11, 17, 56                |
| Repository structure               | 1–2, 9                    |
| Migration/legacy proof or descopes | 26, 49–50                 |
| Phase exits                        | 27, 42, 58                |
