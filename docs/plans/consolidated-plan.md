---
id: solidiom-consolidated-plan
title: "Solidiom — Consolidated Execution Plan"
doc_type: plan
audience: "Solidiom project leads, contributors"
tags: [solidiom, plan, milestones, library, catalog, production]
lifecycle: active
authority: canonical status, sequencing, definitions-of-done, defects, queues, counters, and release gates
volatility: high
date: 2026-08-07
---

# Solidiom — Consolidated Execution Plan

> **Single source of truth** for task state, sequencing, Definitions of Done, approved queues, defects, counters, library release gates, and milestone exit criteria.
>
> - Architecture decisions: [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md)
> - Website architecture: [`docs/architecture/website.md`](../architecture/website.md)
> - History (non-authoritative): [`website-m0-m3.md`](../history/plans/website-m0-m3.md), [`catalog-foundations-2026-08.md`](../history/plans/catalog-foundations-2026-08.md)
> - Contracts: [`recipe-contract.md`](../contracts/recipe-contract.md), [`block-catalog-manifest.json`](../contracts/block-catalog-manifest.json), [`beta-coverage-matrix.md`](../contracts/beta-coverage-matrix.md)

---

## 1. Current Position

- **M0–M4 complete.** Primitives 52/52; components 30/30; blocks 36/36; templates 29/29. All gates green.
- **M5 (GA hardening → production)** is the active milestone — focused on QA, security, operations, primitive promotion, and cutover.
- **M6 (post-GA growth)** follows G5 — playground, marketing, analytics, newsletter, and editorial content.
- **Library release** tracks independently: Phase 3 beta blockers → Phase 3A/3B → Phase 4 (Solid 2 GA) → Phase 5 (v2).
- Workflows are dispatch-only; local or explicitly dispatched evidence is required. Automatic triggers will be enabled post-GA.

---

## 2. Milestone Map

| Milestone | Scope | Status |
|-----------|-------|--------|
| M0 | Governance/inputs | Complete |
| M1 | Foundation/alpha | Complete (CI-001 policy blocker remains) |
| M2 | Content vertical slice | Complete |
| M3 | Public beta platform | Complete — G3 closed |
| M4 | Catalog completion | Complete — G4 closed |
| **M5** | **GA hardening & production cutover** | **In progress** |
| **M6** | **Post-GA growth (playground, marketing, analytics, newsletter)** | Not started |

---

## 3. Task States and Rules

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete and validated
- `[!]` Blocked (row names the blocker)
- `[-]` Descoped

A row becomes `[x]` only when its acceptance boundary is re-checked by the named gate or recorded targeted evidence. Never change a counter to make a ratchet green.

---

## 4. Open Defects

| Status | ID | Size | Description |
|--------|-----|------|-------------|
| [x] | CI-008 | XS | Restore automatic triggers or document accepted dispatch ownership/cadence |
| [x] | RECIPE-008 | XS | Remove duplicate utility imports, port typeset/prose demos, preserve utility exceptions |
| [x] | REG-008 | M | Asymmetric registry signing (replace symmetric index verification) — Ed25519 keypair provisioned, signing in release workflow, CLI verification working |

---


## 5. Library Release Roadmap

### 5.1 Release model (locked decisions)

- Initial `v1.0.0-beta.x` on Solid 2 beta. Continuous candidates on `next`; only a gate-approved candidate promotes to `beta`.
- Phase 3A compile-time work does not block beta but must finish before first RC.
- Phase 3B generative authoring is an independent unversioned milestone; does not gate v1/v2.
- Phase 4 starts after Solid 2 GA → stable v1. Phase 5 is strict defaults and sunsets → v2.
- Runtime: Nx + pnpm + Changesets, dual `dist/`/`source/` emission, Vitest browser mode.
- Distribution: npm tarballs + signed immutable Cloudflare R2 catalogs + signed mutable channel pointers.

### 5.2 Phase and version map

| Phase | Version | Exit |
|-------|---------|------|
| 0 — architectural proof | v0.6.x | Complete |
| 1 — primitive/package alpha | v0.7.x–v0.8.x | Complete |
| 2 — distribution/enterprise beta | v0.9.x–v0.10.x | Complete |
| 3 — beta stabilization/release | `v1.0.0-beta.x` | Task 60 gate; Task 68 release |
| 3A — compile-time incubation | later beta.x | Task 67; required before first RC |
| 3B — generative authoring | unversioned | Task 3B.8; independent of release |
| 4 — Solid 2 GA / stable v1 | `v1.0.x` | Task 70 gate; Task 73 release |
| 5 — strict enforcement / v2 | `v2.0.x` | Task 78 |

### 5.3 Initial-beta blockers

| Status | ID | Description | Accept |
|--------|-----|-------------|--------|
| [ ] | C8 | Beta accessibility evidence — axe + keyboard + VoiceOver for all 52 primitives and 30 components | Evidence files enumerate complete beta surface with durable runs |
| [~] | C9 / Task 60 | Preflight vs final acceptance — `tools/phase3-gate.ts` as final release approval | Preflight green + negative fixtures prove gate rejects missing requirements |
| [ ] | C10 / Task 68 | Signed beta artifacts — npm, `apps/site`, immutable catalog, signed pointer | Clean package/source consumers verify tarballs, catalog, and pointer signatures |
| [ ] | C11 | Public-package classification — resolve every publishable-but-untracked package | No publishable package sits outside public catalog or explicit non-public set |

### 5.4 Phase 3 — active tasks

| Status | ID | Description |
|--------|-----|-------------|
| [x] | Task 59 | Repository truth reconciliation |
| [~] | Task 60 | Phase 3 preflight and final release gate |
| [ ] | Task 61 | Beta release notes and docs in `apps/site` |
| [ ] | Task 65 | Cross-browser beta certification (Chromium, Firefox, WebKit) |
| [-] | Task 66 | Legacy/migration beta readiness (descoped — greenfield product) |
| [ ] | Task 68 | Initial beta release — promote gate-approved `next` to `beta` |

### 5.5 Phase 3A — compile-time incubation

| Status | ID | Description |
|--------|-----|-------------|
| [~] | Task 62 | Static recipe extraction beta |
| [~] | Task 63 | Static variant expansion beta |
| [~] | Task 64 | Dead-part elimination beta |
| [~] | Task 67 | Unused-capability detection and Phase 3A gate |

### 5.6 Phase 3B — generative authoring tooling

| Status | ID | Description |
|--------|-----|-------------|
| [ ] | Task 3B.1 | Versioned primitive contract and manifest migration |
| [ ] | Task 3B.2 | Internal generator core (`pnpm scaffold primitive`) |
| [ ] | Task 3B.3 | Generated package and aggregator wiring |
| [ ] | Task 3B.4 | Complete recipe scaffolding |
| [ ] | Task 3B.5 | Authored demo starter plus generated registration |
| [ ] | Task 3B.6 | Idempotent sync/fixer mode |
| [ ] | Task 3B.7 | Independent CI drift gate |
| [ ] | Task 3B.8 | Retire copy-paste authoring |

### 5.7 Phase 4 — Solid 2 GA and stable v1

| Status | ID | Description |
|--------|-----|-------------|
| [ ] | Task 69 | Solid 2 GA transition |
| [ ] | Task 71 | External accessibility audit and full AT records |
| [ ] | Task 74 | Compile-time optimizations GA |
| [ ] | Task 75 | Legacy sunset schedule |
| [ ] | Task 76 | v1.x maintenance policy |
| [ ] | Task 70 | Stable v1 acceptance gate |
| [ ] | Task 72 | Release candidate hardening |
| [ ] | Task 73 | v1 stable release |

### 5.8 Phase 5 — strict enforcement and v2

| Status | ID | Description |
|--------|-----|-------------|
| [ ] | Task 77 | v2 strict enforcement |
| [ ] | Task 78 | v2 stable release |

---


## 6. M5 — GA Hardening and Production Cutover

M5 is scoped to **ship a production-quality product**. It covers QA, security, operations, primitive promotion, legacy cutover, and the production deploy. Marketing, playground, analytics, and newsletter are deferred to M6.

### 6.1 Quality, Security & Compliance

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | QA-001 | L | WCAG 2.2 AA/APG audit and critical/serious fixes | G4 |
| [ ] | QA-002 | L | Supported desktop/mobile browser matrix and fallbacks | G4 |
| [ ] | QA-003 | L | Full visual matrix approval and intentional diffs | G4 |
| [ ] | QA-004 | M | Final performance and bundle budgets | G4 |
| [ ] | QA-005 | M | Full bilingual, links, SEO, feed, structured-data audit | G4 |
| [ ] | QA-006 | M | Search coverage, locale, keyboard, ranking, privacy audit | G4 |
| [ ] | QA-007 | M | Registry, signature, CSP, sandbox, dependency, project security | G4 |
| [ ] | QA-008 | M | Full CLI command/package-manager/offline/rollback matrix | G4 |
| [ ] | QA-009 | S | Analytics/newsletter/provider privacy audit | G4 |
| [ ] | QA-010 | S | Final legal/policy review and publication | GOV-001..006 |

### 6.2 G5 Primitive Promotion (52 items)

Per primitive, in order: Spanish flips to `translationStatus: human-reviewed` → registry `status` moves to `stable`. This arms:

- `a11y:coverage-gate` enforces only where `status` is `stable`.
- `validate-translation-freshness.ts` derives GA maturity and blocks on anything not `human-reviewed`.
- Full manual evidence matrix from `A11Y-005` (keyboard, focus, zoom, contrast, reduced motion, screen readers, touch) must be recorded per primitive before `stable`.

### 6.3 Operations & Cutover

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | OPS-004 | M | Production Cloudflare/DNS/headers/cache/monitoring/rollback | OPS-003, QA-004..010 |
| [ ] | OPS-005 | S | Production deployment and rollback rehearsal | OPS-004 |
| [ ] | CUT-001 | M | Resolve every legacy inventory item | MIG-001, G4 |
| [ ] | CUT-002 | S | Archive POC findings, verify parity, remove POC | CUT-001, BASE-001 |
| [ ] | CUT-003 | M | Remove legacy docs after verified parity | CUT-001 |
| [ ] | CUT-004 | S | Remove migration-only tooling/assets/configuration | CUT-002, CUT-003 |
| [ ] | CUT-005 | S | Publish GA notes, migration, limitations, rollback reference | OPS-005, CUT-004 |
| [ ] | CUT-006 | S | **Deploy canonical production and announce** | CUT-005 |

### G5 Exit Checklist

- [ ] `docs/architecture/website.md` §9 passes
- [ ] No temporary maturity, translation, security, accessibility, or performance exception remains
- [ ] All 52 primitives promoted to `stable` (human-reviewed Spanish + manual evidence)
- [ ] GA accessibility and translation gates pass with zero violations
- [ ] Production deployment and rollback rehearsed
- [ ] Legacy docs and POC removed after parity verification
- [ ] `solidiom.org` and locale alternates resolve correctly
- [x] Open defects (CI-008, RECIPE-008, REG-008) closed or formally accepted

### M5 Critical Path

```text
QA-001..010 (parallel) ──────────────────────────────────────┐
                                                             │
G5 primitive promotion (52×) ────────────────────────────────┤
                                                             ↓
                          OPS-004 → OPS-005 → CUT-001..004 → CUT-005 → CUT-006 (PRODUCTION)
```

---


## 7. M6 — Post-GA Growth

M6 begins after G5 exit. These work streams enhance the live product but do not block production.

### 7.1 Curated Playground

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | PLAY-001 | M | Threat model, sandbox, CSP, protocol, limits, prohibited imports | SITE-012 |
| [ ] | PLAY-002 | L | Worker-based TSX/CSS compilation with pinned local deps | PLAY-001 |
| [ ] | PLAY-003 | L | Sandboxed iframe runtime, reset, diagnostics, timeout, teardown | PLAY-001, PLAY-002 |
| [ ] | PLAY-004 | M | Accessible editor/preview/output controls as route-local app | PLAY-002, SITE-004 |
| [ ] | PLAY-005 | M | Curated canonical examples (state, form, overlay, composition) | CONTENT-005, PLAY-004 |
| [ ] | PLAY-006 | S | Categorical analytics only; no source/error payload leakage | PLAY-003, GOV-004 |
| [ ] | PLAY-007 | M | Browser, a11y, CSP, isolation, leak, and boundary tests | PLAY-001..006 |
| [ ] | PLAY-008 | S | Static unsupported-browser fallback with source access | PLAY-004 |

### 7.2 Marketing & Editorial

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | MKT-001 | L | Responsive evidence-based homepage | G1, BRAND-004 |
| [ ] | MKT-002 | M | Accurate layer landing/directory shells | REG-003, SITE-004 |
| [ ] | MKT-003 | M | Core guide skeletons | CONTENT-002 |
| [ ] | MKT-004 | M | Accessibility landing page from real evidence | A11Y-003 |
| [x] | MKT-005 | S | Bilingual registry/CLI ownership guide | REG-003 |
| [ ] | MKT-006 | M | Technical Enterprise page (no sales/SLA claims) | GOV-002, REG-003 |
| [ ] | MKT-007 | S | GitHub-only community/contributing pages | GOV-003 |
| [ ] | MKT-008 | M | Article: Solid 2 architecture | CONTENT-002 |
| [ ] | MKT-009 | M | Article: accessible interaction contracts | CONTENT-002 |
| [ ] | MKT-010 | M | Article: source ownership | CONTENT-002 |
| [ ] | MKT-011 | M | Article: styling-system neutrality | CONTENT-002 |
| [ ] | MKT-012 | M | Article: building with Solidiom | CONTENT-002 |
| [ ] | MKT-013 | S | Changelog/migration types, feeds, archives, metadata | CONTENT-002 |

### 7.3 Analytics

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | ANALYTICS-001 | M | Typed PostHog adapter; autocapture/replay disabled | GOV-004, SITE-004 |
| [ ] | ANALYTICS-002 | S | Tests reject prohibited payload fields | ANALYTICS-001 |
| [ ] | ANALYTICS-003 | S | Production provider configuration outside source | ANALYTICS-001 |

### 7.4 Newsletter

| Status | ID | Size | Description | Depends on |
|--------|-----|------|-------------|------------|
| [ ] | NEWS-001 | M | Consent-based bilingual Buttondown flow | GOV-005, SITE-006 |
| [ ] | NEWS-002 | S | Keyboard, error, localization, privacy, endpoint tests | NEWS-001 |

### G6 Exit Checklist

- [ ] Playground live, sandboxed, and passing all security/a11y tests
- [ ] Homepage and landing pages live with real evidence
- [ ] All 5 foundational articles published
- [ ] Analytics live with privacy audit passing
- [ ] Newsletter operational with consent and bilingual support
- [ ] Community/contributing pages live

---


## 8. Shared Catalog-Item Definitions of Done

Each layer's DoD is tiered into a machine-checkable bar and a review bar.

### 8.1 Primitive DoD

#### 8.1.1 M4 bar (enforced by `PRIM-000`)

A `PRIM-*` row may go `[x]` when all nine hold:

1. Registry records `documentation.status: "complete"` and `accessibility.reviewStatus: "automated"` with ≥1 evidence ID, bilingual search keywords, current integrity data, and committed registry matches source truth.
2. English overview contains required sections: Usage, Installation, Parts & Props, Styling, SSR and hydration, Keyboard & behavior.
3. Conditional sections present or declared `notApplicable` with stated reason: Composition, Relationships, Migration notes, Testing.
4. Spanish mirrors 2 and 3, carries `translationStatus: draft` and real `translationSourceHash`, passes glossary/protected-literal checks.
5. At least one example. `runnable: true` with live Solid island if accessibility contract declares keyboard interaction; otherwise `runnable: false` with declared reason.
6. Authored accessibility contract in English and Spanish per `A11Y-002` schema.
7. Committed `packages/<name>/docs/accessibility/evidence.json` with passing summary and `passes > 0`.
8. API artifact present and source-linked; all four routes render in both locales.
9. Registry `status` remains `preview`.

#### 8.1.2 G5 bar (per-primitive promotion)

Spanish flips to `translationStatus: human-reviewed` → registry `status` moves to `stable`. Arms `a11y:coverage-gate` and `validate-translation-freshness.ts`. Full manual evidence matrix from `A11Y-005` required before `stable`.

### 8.2 Component DoD

#### 8.2.1 M4 bar (enforced by `FOUND-004`)

A `COMP-*` row may go `[x]` when all ten hold:

1. **Physical form.** Recipe wrapper for each shipped styling profile plus primitive dependency.
2. **Canonical contract.** Scope in `tools/recipe-contract-definitions.ts`, validated by `recipe:contract`.
3. **Three outputs, no fork.** CSS/Tailwind/UnoCSS emit checks pass, parity and drift green.
4. **Registry.** `registry/components/<name>.json` with source files per output, integrity, `documentation.status: "complete"`.
5. **Source install.** `solidiom plan`/`add`/`verify`/`diff` resolve to wrapper for `config.stylingProfile`.
6. **English docs** at `apps/site/src/content/en/components/<name>.md` with required sections.
7. **Spanish mirror** with `translationStatus: draft`, real hash, passing checks.
8. **At least one example** per `CONTENT-005`.
9. **Accessibility by reference.** Cites primitive contract and evidence; component note only where wrapper changes semantics.
10. **Routes.** `/components/<name>/` renders in both locales; `REG-007` reports one route.

#### 8.2.2 Review bar (human)

- No duplicate behavior layer over primitive.
- Tests cover states, variants, slots, composition, disabled/loading/error.
- Theme previews render across all four presets in light and dark.
- Spanish human review is a G5 requirement.

### 8.3 Block DoD

#### 8.3.1 M4 bar (enforced by `FOUND-005`)

A `BLOCK-*` row may go `[x]` when all ten hold:

1. Named in `block-catalog-manifest.json` with outcome and data boundary.
2. Dependencies resolve by name to approved `COMP-001..030` rows, all complete.
3. `proposedComponents` empty or absorbed by amendment.
4. Structured states: `loading`, `empty`, `error`, `restricted` declared and matching prose.
5. All four states implemented in source.
6. Full-page and embedded previews exist and render.
7. `registry/blocks/<name>.json` with integrity; appears in index.
8. `solidiom add`/`verify`/`diff` resolve and verify; fail closed on mismatch.
9. Bilingual docs with required sections, Spanish at `translationStatus: draft`.
10. `/blocks/<name>/` renders in both locales; `REG-007` reports one route.

### 8.4 Template DoD

#### 8.4.1 M4 bar (enforced by `TPL-000` validator + `CLI-008`)

A `TPL-*` row may go `[x]` when all eight hold:

1. Listed in manifest targeting one of SolidStart/TanStack Start Solid/Vite + Solid Router.
2. `templates/<name>/` exists with `template.json` per CLI-007.
3. Four package managers pass in CLI-008 offline fixture.
4. Generated project builds, typechecks, starts.
5. Generated project passes smoke and a11y tests in offline fixture.
6. Every `requiredBlocks` entry is a complete `BLOCK-*` row.
7. `registry/templates/<name>.json` with integrity and signed manifest.
8. Bilingual docs and `/templates/<name>/` renders in both locales.

---


## 9. M4 Catalog — Completed Queues (reference)

### 9.1 Primitives — 52/52

All `PRIM-001..052` meet §8.1.1 under `PRIM-000`. G5 promotion is tracked in §6.2.

### 9.2 Components — 30/30

| ID | Component | Status |
|----|-----------|--------|
| COMP-001 | Button | [x] |
| COMP-002 | Input | [x] |
| COMP-003 | Field | [x] |
| COMP-004 | Card | [x] |
| COMP-005 | Alert | [x] |
| COMP-006 | Dialog | [x] |
| COMP-007 | Select | [x] |
| COMP-008 | Dropdown Menu | [x] |
| COMP-009 | Tabs | [x] |
| COMP-010 | Toast | [x] |
| COMP-011 | Tooltip | [x] |
| COMP-012 | Avatar | [x] |
| COMP-013 | Checkbox | [x] |
| COMP-014 | Radio Group | [x] |
| COMP-015 | Switch | [x] |
| COMP-016 | Combobox | [x] |
| COMP-017 | Popover | [x] |
| COMP-018 | Sheet | [x] |
| COMP-019 | Navigation Menu | [x] |
| COMP-020 | Breadcrumb | [x] |
| COMP-021 | Pagination | [x] |
| COMP-022 | Command Palette | [x] |
| COMP-023 | Data Table | [x] |
| COMP-024 | Kbd | [x] |
| COMP-025 | Meter | [x] |
| COMP-026 | Progress | [x] |
| COMP-027 | Resizable Panels | [x] |
| COMP-028 | Scroll Area | [x] |
| COMP-029 | Spinner | [x] |
| COMP-030 | Toolbar | [x] |

`accordion`, `badge`, and `menu` remain unapproved registry slugs.

### 9.3 Blocks — 36/36

All `BLOCK-*` rows complete: AUTH-01..03, ONBOARD-01..03, SETTINGS-01..03, BILLING-01..03, ADMIN-01..03, OBS-01..03, RESOURCE-01..03, AI-01..03, SEARCH-01..03, COMMERCE-01..03, CONTENT-01..03, SHELL-01..03.

### 9.4 Templates — 29/29

All `TPL-001..029` implemented. Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist but are not approved catalog rows.

### 9.5 Theme Presets — 4/4

Ocean, Forest, Slate, Aurora. PRESET-006, BUILDER-007, BUILDER-008 all closed.

---


## 10. Scope Counters

| Scope | Required | DoD | Landed |
|-------|-------:|---:|------:|
| Primitives | 52 | 52 | 52 |
| Components | 30 | 30 | 30 |
| Blocks | ≥ 36 | 36 | 36 |
| Unique templates | 29 | 29 | 29 |
| Template portfolio placements | 32 | 0 | 0 |
| Theme presets | 4 | 4 | 4 |
| Foundational articles | 5 | 0 | 0 |
| Locales | 2 | 2 | 2 |

---

## 11. Canonical Verification Commands

Run from a clean tree before changing status.

```sh
# Formatting and revision
pnpm exec prettier --check \
  docs/plans/README.md \
  docs/plans/consolidated-plan.md \
  docs/architecture/decisions/catalog-decisions.md \
  docs/history/plans/website-m0-m3.md \
  docs/history/plans/catalog-foundations-2026-08.md
git rev-parse HEAD
git status --short

# Catalog and integration gates
pnpm run primitive:catalog-gate   # 52/52
pnpm run component:catalog-gate   # 30/30
pnpm run block:catalog-gate       # 36/36
pnpm run template:catalog-gate    # 29/29
pnpm run recipe:contract          # 34/34
pnpm run audit:recipe-drift       # 0 issues
pnpm run audit:recipe-parity      # 0 issues
pnpm run audit:package-source-parity # 0 issues
pnpm --filter @solidiom/recipes-css build
pnpm --filter @solidiom/recipes-tailwind build
pnpm --filter @solidiom/recipes-unocss build
pnpm run test:tools               # 382/382
pnpm run gate:phase1              # 255/255
pnpm --filter @solidiom/site run translation:check

# Controls affected by broader work
pnpm --filter @solidiom/cli test  # 300 tests
pnpm run gate:vertical-slice      # 67/67
pnpm --filter @solidiom/site check
```

---

## 12. Update Rules

- Change task states, DoD, queues, defects, and counters only in this document.
- Change durable rationale only through a decision update in `catalog-decisions.md`.
- Add historical evidence to history documents without making them sources of current status.
- Re-run the canonical command set before changing a status.
- Inspect `git status` after validation runs; restore only paths produced by that run.

---

## 13. Decision Pointers (D1–D6)

Durable rationale lives in [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md):

- **D1** — A component is the active-profile recipe wrapper + primitive dependency.
- **D2** — Registry v3 uses namespaced manifests.
- **D3** — Catalog prose lives in layer-aware bilingual site content.
- **D4** — Block states are structured and retain prose.
- **D5** — Class prefixes are derived by default.
- **D6** — Correct component citations instead of deferring them.
