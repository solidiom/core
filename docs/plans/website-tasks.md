---
id: website-tasks
title: "Solidiom Website — Implementation Tasks"
doc_type: reference
audience: "Solidiom project leads, contributors"
tags: [website, tasks, backlog, milestones]
lifecycle: active
date: 2026-08-02
---

# Solidiom Website — Implementation Tasks

**Status:** in execution — M0–M3 complete; M4 primitives complete (52/52 pass PRIM-000), components/blocks/templates pending; M5 in progress incidentally
**Source plan:** `docs/plans/website-plan.md`
**Visual reference:** `docs/assets/solidiom-site.png`
**Target application:** `apps/site/`
**Canonical origin:** `https://solidiom.org`

Current position: all 52 primitives meet the M4 bar (§8.1.1) and are enforced by `tools/primitive-catalog-gate.ts`. The component queue (§9.2) is unblocked _as a queue_ but cannot start until §9.0's machinery lands — components, blocks, templates, and themes have no registry arrays, no source resolution, no routes, and no gates today. `M5` has begun incidentally (`MKT-005`, `BUILDER-008`).

> **Infrastructure resolved.** `.github/workflows/ci.yml` parses and loads 22 jobs (CI-005). `format:check` passes (CI-006). `beta-acceptance-e2e` is blocking (CI-007). The vertical-slice gate delegates to PRIM-000 (VS-005). The BUILD-001 staleness guard is active and satisfiable — generated artifacts no longer carry wall-clock or HEAD-derived stamps. `site-visual` is containerised and blocking (TEST-005). The tools test suite runs in CI (`test:tools`), where 17 of its 35 files previously ran nowhere. Registry and evidence files are committed and current (A11Y-009). Typeset/prose are in the canonical contract across all three profiles (RECIPE-007). The block manifest's misnumbered component citations are corrected and §9.2 extended to 30 (BLOCK-000B, superseding BLOCK-000A's incorrect diagnosis). Visual baselines pass 36/36 in the pinned container and in CI (TEST-005). A full CI run has now been observed: run `30871761546` was green across all 31 jobs — 22 declared, 31 after matrix expansion — including the eleven that had never executed.
>
> **That run is not at `HEAD`.** It was taken at `079512e`. The four commits since (`3705238`, `ef4d214`, `b8c1f17`, `bb1a0c7`) have no green run of their own. The `HEAD` run (`30878697281`, attempt 2) is green on 29 of 31 jobs — including `phase1-gate` with the new §12/§13 sections, `site-visual` now blocking, `beta-acceptance-e2e` at 111 and `site-e2e` at 435 — but `phase2-gate` failed after 2 seconds with no steps recorded and no log, which is a runner startup failure rather than a gate failure (`pnpm run gate:phase2` passes 67/67 locally), and `phase0-gate`/`phase3-gate` were skipped behind it. Re-dispatch to confirm.
>
> **Workflows no longer run automatically.** As of 2026-08-04 all five workflows are `workflow_dispatch`-only; the push and pull-request triggers are commented in place in `ci.yml` and `preview-deploy.yml` (`CI-001`). Read every "enforced by CI" statement below as "enforced when someone dispatches the workflow". That weakens, but does not invalidate, the evidence recorded here — the jobs and gates are unchanged.

---

## 1. How to use this backlog

This document translates the approved implementation plan into executable work. The plan remains the authority for product intent; this backlog controls sequencing and completion.

### 1.1 Task states

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete and validated
- `[!]` Blocked; record the blocking task or external dependency beside it

### 1.2 Size guide

| Size | Expected effort | Rule                                                                  |
| ---- | --------------: | --------------------------------------------------------------------- |
| XS   |         ≤ 1 day | One focused change and targeted validation                            |
| S    |        1–2 days | One reviewable pull request                                           |
| M    |        3–5 days | May use stacked pull requests but has one acceptance boundary         |
| L    |       1–2 weeks | Must have intermediate checkpoints                                    |
| XL   |       > 2 weeks | Work package; split into implementation pull requests before starting |

Catalog rows marked `WP` are work packages. Each instantiates the shared item Definition of Done and must be split into reviewable implementation tasks when assigned.

### 1.3 Dependency notation

- `—`: may start immediately.
- `G0`–`G5`: milestone exit gates defined below.
- A task ID: that task must be complete first.
- `required PRIM-*`, `required COMP-*`, or `required BLOCK-*`: resolve exact dependencies in registry metadata before starting the item.

### 1.3.1 Conditional requirements

Several DoDs contain requirements that apply to some items and not others. The resolution is consistent across §8:

- A **conditional requirement** may be satisfied by a declared `notApplicable` reason in the document's frontmatter rather than by implementing the section.
- `PRIM-000` accepts a declared reason the same way `a11y:coverage-gate` accepts non-applicable accessibility criteria — the absence of the section is valid only when accompanied by an authored justification.
- A list of items that must give a reason is not maintained; the requirement itself defines applicability (e.g. "Composition: only for compound primitives"). If in doubt, include the section.

### 1.4 Global Definition of Done

Every completed implementation task must:

1. Have no unreviewed scope or undocumented exception.
2. Use Solidiom primitives/components for website interactions.
3. Pass the most targeted unit/browser checks plus affected typecheck and build targets.
4. Include accessibility behavior and keyboard validation when UI changes.
5. Add or update English and Spanish content when user-facing text changes.
6. Preserve static rendering and route-level lazy-loading boundaries.
7. Avoid sending search terms, code, theme values, email addresses, or free-form content to analytics.
8. Update registry/content schemas and generated artifacts instead of creating parallel handwritten metadata.
9. Include migration notes when it changes a public package, registry, CLI, route, or content contract.
10. Leave the working tree formatted and free of new diagnostics.

---

## 2. Start-now queue

> **Historical.** Every task in this section and in the first merge sequence below is complete, and G0–G2 have passed. Both are retained as a record of the intended entry order, not as current instruction. For current work see §11 and §7.3.

These tasks have no implementation dependency and can begin in parallel. Start with `SITE-001`, `MIG-001`, `BRAND-001`, and `REG-001`.

| Order | ID        | Why it can start now                                     | Canonical definition |
| ----: | --------- | -------------------------------------------------------- | -------------------- |
|     1 | SITE-001  | The validated POC configuration exists.                  | §5.1                 |
|     2 | MIG-001   | The legacy app is available for inventory.               | §4                   |
|     3 | BRAND-001 | The plan and board define the canonical direction.       | §4                   |
|     4 | REG-001   | Current registry v1 output and generator exist.          | §6.1                 |
|     5 | GOV-001   | The licensing split is decided.                          | §4                   |
|     6 | GOV-002   | GitHub private reporting is decided.                     | §4                   |
|     7 | BASE-001  | The unchanged POC can be measured immediately.           | §4                   |
|     8 | OPS-001   | Account/domain ownership can be confirmed independently. | §4                   |

### First merge sequence

1. `SITE-001` — create the target application.
2. `SITE-002` — make it a first-class Nx/workspace project.
3. `SITE-003` — lock a green static baseline.
4. `BRAND-002` + `BRAND-003` — tokens and fonts.
5. `SITE-004` — base document and theme bootstrap.
6. `REG-001` → `REG-002` — schema implementation.
7. `CONTENT-001` + `I18N-001` — content and locale loaders.
8. `DOCS-001` — generated catalog route shell.
9. `API-001` + `A11Y-001` — generated evidence pipelines.
10. `VS-001` — Dialog vertical slice.

Do not begin bulk catalog production before `VS-004` proves the complete vertical slice.

---

## 3. Milestone map and critical path

| Gate | Milestone                       | Exit condition                                                                                                                                 | Primary blockers                                                   |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| G0   | Governance and canonical inputs | Brand, licensing, security, privacy, migration, and account prerequisites are explicit.                                                        | External policy review and domain/account access                   |
| G1   | Foundation/private alpha shell  | `apps/site` builds, deploys to preview, supports both locales/themes, and dogfoods Solidiom.                                                   | Site scaffold, tokens, shell, CI                                   |
| G2   | Content-platform vertical slice | Dialog, Combobox, and Data Table prove registry → routes → API → examples → a11y → i18n → search.                                              | Registry v2, TypeDoc, a11y, content loaders                        |
| G3   | Public beta platform            | Useful catalog subset, CLI flows, themes, and theme-builder beta are live with maturity labels.                                                | G2 plus recipe/CLI/tool foundations                                |
| G4   | Catalog completion              | 52 primitives, 30 components, 36+ blocks, 29 templates/32 placements, four themes, and both languages meet item DoDs.                          | Catalog work queues and smoke matrices                             |
| G5   | GA and cutover                  | Full quality, security, browser, performance, legal, SEO, playground, marketing, analytics, and migration gates pass; legacy apps are removed. | G4 plus playground, marketing, hardening, and production readiness |

### Critical path

```text
SITE-001 → SITE-002 → SITE-003 → SITE-004
                         ↓
REG-001 → REG-002 → CONTENT-001 → DOCS-001
                         ↓              ↓
API-001 → API-002 ───────┤          VS-001/2/3 → VS-004 (G2)
A11Y-001 → A11Y-002 ─────┤                          ↓
I18N-001 → I18N-003 ─────┘                recipes + CLI + beta (G3)
                                                       ↓
                                      primitives/components/blocks/templates (G4)
                                                       ↓
                                              hardening/cutover (G5)
```

### 3.1 Two numbering schemes: `GN` milestones and `phaseN` gates

The repository contains two independent, similarly-numbered gate sequences. They are not the same thing, and the numbers do not correspond.

| Scheme                         | Owns                                                                                                                             | Defined in                       | Enforced by                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `G0`–`G5` milestone gates      | This document's website programme: governance, site foundation, content platform, beta, catalog, GA                              | `docs/plans/website-tasks.md` §3 | The exit checklist under each milestone, plus the specific CI jobs each checklist item names          |
| `phase0`–`phase3` gate scripts | The **library's** own release readiness: primitive coverage, Solid 2 compatibility, compile-time transforms, prerelease metadata | `tools/phase{0,1,2,3}-gate.ts`   | `pnpm run gate:phase{0,1,2,3}`, wired as the `phase{0,1,2,3}-gate` jobs in `.github/workflows/ci.yml` |

In particular **`gate:phase3` is not the G3 gate.** It gates the library's beta release and knows nothing about this backlog's milestones. G3 is gated by its own exit checklist in §7.3, whose executable portion is `BETA-002`'s acceptance matrix (`beta:acceptance:report`, `beta:acceptance:e2e`).

A fifth script, `tools/phase4-gate.ts`, exists and asserts the library's **stable/GA** criteria (Solid 2 GA, an external accessibility audit at `docs/accessibility-audit-report.md`, ≥ 10 AT records, stable semver on all public packages, finalized legacy sunset dates). It is referenced by no `package.json` script and no workflow job, so it is dead code today. It overlaps M5's `QA-001` and `CUT-005`, and should be wired — or explicitly retired — as part of G5 rather than rediscovered there.

The two schemes do interlock in one direction: several website tasks are enforced _inside_ a phase gate because that is where the repository's existing check infrastructure lives — for example `RECIPE-001`..`006` are asserted by `gate:phase1` §9, and `CLI-001`'s source-tree collision by §9b. When adding enforcement for a website task, prefer extending the relevant phase gate over inventing a parallel mechanism, and record in this document which gate section covers it. Note that `gate:phase1` contains **two** sections numbered §11 (PRESET-005, then the CLI command surface), a §12 added by `TEST-005` for visual-harness image pinning, a §13 added by `A11Y-010` for the adapter styling audit, and a §15 added by `FOUND-008` for the component and block catalog gates; cite them by title rather than number.

---

## 4. M0 — Governance and canonical inputs

| Status | ID        | Size | Depends on | Owner area       | Task and acceptance boundary                                                                                                                               |
| ------ | --------- | ---- | ---------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | GOV-001   | S    | —          | Governance       | Define Apache 2.0 code/output, CC BY 4.0 documentation, and reserved-brand boundaries; identify required notices.                                          |
| [x]    | GOV-002   | S    | —          | Security         | Publish the private vulnerability-reporting process in `SECURITY.md`.                                                                                      |
| [x]    | GOV-003   | S    | GOV-001    | Governance       | Add DCO signoff instructions and contribution provenance requirements to contributing guidance.                                                            |
| [x]    | GOV-004   | M    | —          | Privacy/product  | Define the PostHog allowlist and prohibited payloads in a typed event-schema proposal; autocapture/session replay remain disabled.                         |
| [x]    | GOV-005   | S    | GOV-004    | Privacy/product  | Draft privacy disclosures for Cloudflare, PostHog, Buttondown, Pagefind, playground, and theme-builder behavior.                                           |
| [x]    | GOV-006   | S    | GOV-001    | Brand/governance | Draft the Solidiom trademark and brand-use policy; document ecosystem-logo criteria.                                                                       |
| [x]    | BRAND-001 | S    | —          | Design systems   | Update the written brand specification to exactly match the board palette and typography roles.                                                            |
| [x]    | BRAND-002 | M    | BRAND-001  | Design systems   | Define site-local semantic tokens in `apps/site/src/assets/tokens.css`, including independent light/dark surface hierarchies.                              |
| [x]    | BRAND-003 | S    | BRAND-001  | Design systems   | Select, pin, self-host, and preload Inter Tight, Inter Variable, and IBM Plex Mono assets with documented licenses.                                        |
| [x]    | BRAND-004 | M    | BRAND-001  | Brand/design     | Create vector icon, wordmark, monochrome/light/dark variants, favicon set, and social-card source assets.                                                  |
| [x]    | MIG-001   | M    | —          | Platform/content | Create website migration inventory covering all `apps/docs` routes, demos, reports, and behavior.                                                          |
| [x]    | MIG-002   | XS   | MIG-001    | Repository       | Mark `apps/docs` read-only for new features in its package documentation/ownership guidance.                                                               |
| [x]    | BASE-001  | S    | —          | QA/platform      | Capture the reproducible `apps/docs-astro-poc` validation baseline.                                                                                        |
| [x]    | BASE-002  | S    | —          | Platform         | Reconcile workspace Solid 2 catalog/override versions with direct versions in `apps/docs`; record migration constraints without changing the POC baseline. |
| [x]    | OPS-001   | XS   | —          | Operations       | Confirm `solidiom.org` and Cloudflare access ownership.                                                                                                    |
| [x]    | OPS-002   | S    | OPS-001    | Operations       | Define preview, production, DNS, redirect, header, CSP, rollback, and secret-management responsibilities.                                                  |

### G0 exit checklist

- [x] Palette, type, licensing, trademark, privacy, security, and DCO policies have owners.
- [x] POC baseline is reproducible.
- [x] Legacy-app parity inventory is complete.
- [x] Domain/Cloudflare prerequisites are assigned.
- [x] No production secret or provider key is stored in the repository.

---

## 5. M1 — Foundation and private alpha shell

### 5.1 Application and workspace

| Status | ID       | Size | Depends on                     | Owner area    | Task and acceptance boundary                                                                                                         |
| ------ | -------- | ---- | ------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [x]    | SITE-001 | S    | —                              | Platform      | Create `apps/site` using only POC configuration/integration wiring; package name `@solidiom/site`; retain POC unchanged.             |
| [x]    | SITE-002 | S    | SITE-001                       | Platform      | Add package scripts and Nx metadata for `dev`, `check`, `build`, `preview`, and `search-index`; declare outputs/cache inputs.        |
| [x]    | SITE-003 | S    | SITE-002                       | Platform/QA   | Establish one static route, Astro check, production build, and Pagefind generation as the green baseline.                            |
| [x]    | SITE-004 | M    | SITE-003, BRAND-002, BRAND-003 | Frontend      | Implement base HTML/layout, metadata defaults, font preloads, no-flash locale/theme bootstrap, skip link, and focus root.            |
| [x]    | SITE-005 | M    | SITE-004                       | Frontend      | Implement responsive header/global nav with Solidiom Button, Navigation Menu/Menu, and Dialog/Drawer primitives.                     |
| [x]    | SITE-006 | S    | SITE-004                       | Frontend      | Implement footer, legal/community links, newsletter slot, and responsive behavior; GitHub only.                                      |
| [x]    | SITE-007 | M    | SITE-004                       | Frontend      | Implement documentation shell: generated sidebar slot, article column, TOC slot, mobile nav, and scroll/focus behavior.              |
| [x]    | SITE-008 | M    | SITE-004                       | Frontend      | Implement typography/prose/code styles, Shiki theme pair, copy control, heading anchors, tables, callouts, and print styles.         |
| [x]    | SITE-009 | S    | SITE-004                       | Frontend      | Implement persistent system/light/dark selection before paint with no hydration mismatch.                                            |
| [x]    | SITE-010 | S    | SITE-004                       | Frontend      | Add 404, error-safe static fallback, robots, sitemap baseline, manifest, canonical URL helper, and social metadata helper.           |
| [x]    | SITE-011 | M    | SITE-005, SITE-007             | Accessibility | Verify shell keyboard order, landmarks, zoom, reduced motion, contrast, mobile/touch, and current/previous browser support.          |
| [x]    | SITE-012 | S    | SITE-003                       | Architecture  | Add import-boundary rules so static routes cannot import playground/theme-builder/editor/compiler modules.                           |
| [x]    | SITE-013 | S    | SITE-003                       | Performance   | Add route bundle/hydration reporting and capture initial content/catalog/tool budgets for later CI enforcement.                      |
| [x]    | SITE-014 | S    | MIG-001                        | Migration     | Audit each reusable `apps/docs` demo/component for migrate, rewrite, or retire; no direct copy without current behavior/a11y review. |

### 5.2 Locale foundation

| Status | ID       | Size | Depends on         | Owner area       | Task and acceptance boundary                                                                                                    |
| ------ | -------- | ---- | ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | I18N-001 | M    | SITE-003           | Platform/content | Implement locale configuration: English unprefixed, Spanish `/es/`, explicit locale context, no automatic redirect.             |
| [x]    | I18N-002 | S    | I18N-001, SITE-005 | Frontend         | Implement accessible language switcher with equivalent-route mapping and persisted explicit choice.                             |
| [x]    | I18N-003 | M    | I18N-001           | Content platform | Add canonical/`hreflang` helpers, translated metadata requirements, fallback diagnostics, and route-parity validation.          |
| [x]    | I18N-004 | M    | I18N-001           | Content platform | Define translation source hashes, statuses (`draft`, `human-reviewed`, `stale`), terminology glossary, and GA freshness policy. |

### 5.3 Test, CI, and preview foundation

| Status | ID       | Size | Depends on         | Owner area  | Task and acceptance boundary                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | -------- | ---- | ------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | TEST-001 | S    | SITE-003           | QA          | Add site unit/browser test configuration without coupling it to the legacy Vite docs app.                                                                                                                                                                                                                                                                                                                                                       |
| [x]    | TEST-002 | M    | SITE-005, SITE-007 | QA          | Update Playwright config to start `@solidiom/site` on a dedicated port and cover Chromium, Firefox, and WebKit shell smoke tests.                                                                                                                                                                                                                                                                                                               |
| [x]    | TEST-003 | M    | SITE-004           | QA/design   | Add visual baseline harness for desktop/tablet/mobile × light/dark × English/Spanish; store only intentional reference images.                                                                                                                                                                                                                                                                                                                  |
| [x]    | TEST-004 | S    | SITE-013           | Performance | Add Lighthouse and bundle-report scripts with report artifacts; thresholds remain advisory until G2.                                                                                                                                                                                                                                                                                                                                            |
| [!]    | CI-001   | S    | SITE-002           | CI          | Add pull-request and main-branch triggers to `.github/workflows/ci.yml` while retaining manual dispatch. **Deliberately reverted 2026-08-04** at the owner's request: all five workflows are `workflow_dispatch`-only and the push/pull-request triggers are commented in place in `ci.yml` and `preview-deploy.yml` for verbatim restoration. Blocked on that decision being revisited; `OPS-003`'s PR preview is disabled by the same change. |
| [x]    | CI-002   | M    | TEST-001, TEST-002 | CI          | Add site check/build/e2e jobs with cached dependencies and failure artifacts.                                                                                                                                                                                                                                                                                                                                                                   |
| [x]    | CI-003   | S    | TEST-003, TEST-004 | CI          | Add visual/Lighthouse report jobs in advisory mode.                                                                                                                                                                                                                                                                                                                                                                                             |
| [x]    | CI-004   | S    | SITE-003           | CI          | Ensure Solid-matrix jobs explicitly include/exclude `@solidiom/site` according to supported integration behavior.                                                                                                                                                                                                                                                                                                                               |
| [x]    | OPS-003  | M    | OPS-002, SITE-003  | Operations  | Configure Cloudflare Pages preview deployment and verify headers, redirects, asset caching, and preview access policy. The pipeline is unchanged, but `preview-deploy.yml` is dispatch-only since 2026-08-04, so no preview is produced per pull request (`CI-008`).                                                                                                                                                                            |

### G1 exit checklist

- [x] Static `apps/site` builds independently and through Nx.
- [x] English and Spanish shell routes render with canonical and `hreflang` metadata.
- [x] Theme and locale selection apply before paint and persist.
- [x] Header, mobile navigation, theme switch, and language switch use Solidiom interactions.
- [x] Preview deployment and cross-browser shell tests pass. Note the per-PR preview no longer triggers automatically — `preview-deploy.yml` is dispatch-only as of 2026-08-04, and its job body depends on PR context, so it is effectively off until the trigger is restored (`CI-001`, `CI-008`).
- [x] POC remains unchanged and legacy docs remain available/read-only.

---

## 6. M2 — Content platform and vertical slice

### 6.1 Registry and integrity

| Status | ID      | Size | Depends on | Owner area        | Task and acceptance boundary                                                                                                                           |
| ------ | ------- | ---- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [x]    | REG-001 | M    | —          | Registry/platform | Design registry schema v2 and migration rules.                                                                                                         |
| [x]    | REG-002 | M    | REG-001    | Registry/platform | Implement versioned schema/types/validation in `tools/registry-build.ts`; preserve current 52 primitives and 6 adapters.                               |
| [x]    | REG-003 | M    | REG-002    | Registry/platform | Add deliverables, documentation status, locale status, search, evidence, theme, and provenance fields sourced from package metadata/content manifests. |
| [x]    | REG-004 | S    | REG-002    | Registry/platform | Add deterministic output, stable sorting, schema version checks, and fixture/snapshot tests.                                                           |
| [x]    | REG-005 | M    | REG-002    | Security/CLI      | Generate per-file digests and signed versioned index metadata compatible with existing CLI verify/Sigstore dependencies.                               |
| [x]    | REG-006 | M    | REG-005    | CLI/security      | Extend `packages/cli` verification to fail closed on missing/invalid signatures, hashes, or pinned metadata; add tamper tests.                         |
| [x]    | REG-007 | S    | REG-003    | CI                | Add invariant: each public deliverable generates exactly one valid route; missing/duplicate routes fail CI.                                            |

### 6.2 Content collections and route generation

| Status | ID          | Size | Depends on            | Owner area       | Task and acceptance boundary                                                                                                                                         |
| ------ | ----------- | ---- | --------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | CONTENT-001 | M    | SITE-003, REG-002     | Content platform | Configure Astro loaders for site-wide content and `packages/*/docs/**` without copying package docs into the app.                                                    |
| [x]    | CONTENT-002 | M    | CONTENT-001, I18N-004 | Content platform | Define versioned frontmatter schemas for guides, primitive prose, examples, accessibility contracts, components, blocks, templates, themes, articles, and changelog. |
| [x]    | CONTENT-003 | S    | CONTENT-002           | Content platform | Add content validation for required metadata, unique slugs, product identity, status, dates, and locale parity.                                                      |
| [x]    | CONTENT-004 | S    | CONTENT-002           | Content platform | Add source-hash and translation-freshness generator; stale/missing GA translations fail validation.                                                                  |
| [x]    | CONTENT-005 | S    | CONTENT-002           | Content platform | Define code/example source extraction so displayed code and executable examples share a canonical source.                                                            |

### 6.3 API and accessibility evidence

| Status | ID       | Size | Depends on            | Owner area    | Task and acceptance boundary                                                                                                                                    |
| ------ | -------- | ---- | --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | API-001  | M    | SITE-002              | API platform  | Select and pin TypeDoc; add Nx `api` target with declared inputs/outputs and package-build dependencies.                                                        |
| [x]    | API-002  | L    | API-001               | API platform  | Define and implement versioned Solidiom API schema normalization for components, contexts, functions, props, children, inheritance, comments, and source links. |
| [x]    | API-003  | M    | API-002, SITE-008     | Frontend/API  | Build static Astro API renderers, heading extraction, deep links, copy actions, and empty/error diagnostics.                                                    |
| [x]    | API-004  | S    | API-002               | CI            | Fail on undocumented/unresolved public exports; snapshot normalized Dialog, Combobox, and Data Table outputs.                                                   |
| [x]    | API-005  | S    | API-003, I18N-001     | Content       | Translate API explanatory UI while preserving identifiers, signatures, attributes, and source literals.                                                         |
| [x]    | A11Y-001 | M    | SITE-002              | Accessibility | Extend existing axe artifacts to emit stable per-primitive evidence IDs and machine-readable result summaries.                                                  |
| [x]    | A11Y-002 | M    | A11Y-001, CONTENT-002 | Accessibility | Define authored contract schema: keyboard, focus, semantics, ARIA, consumer duties, non-applicable criteria, and review status.                                 |
| [x]    | A11Y-003 | M    | A11Y-002, SITE-008    | Frontend/a11y | Build static accessibility renderer combining authored contract and generated evidence without overstating conformance.                                         |
| [x]    | A11Y-004 | S    | A11Y-001              | CI            | Make missing/stale evidence fail for GA-status entries; retain artifact provenance and CI run links.                                                            |
| [x]    | A11Y-005 | M    | A11Y-003              | Accessibility | Define manual evidence matrix for keyboard, focus, zoom, contrast, reduced motion, screen readers, and touch.                                                   |
| [x]    | A11Y-006 | S    | A11Y-002, I18N-004    | Content       | Add bilingual accessibility terminology and human-review checklist.                                                                                             |

### 6.4 Catalog routes, navigation, and search

| Status | ID         | Size | Depends on                     | Owner area       | Task and acceptance boundary                                                                                                         |
| ------ | ---------- | ---- | ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [x]    | DOCS-001   | M    | REG-003, CONTENT-001, SITE-007 | Frontend         | Generate primitive directory and `/primitives/[name]/` overview routes from registry/content data.                                   |
| [x]    | DOCS-002   | M    | DOCS-001, API-003, A11Y-003    | Frontend         | Generate static `/api/`, `/examples/`, and `/accessibility/` routes styled as tabs.                                                  |
| [x]    | DOCS-003   | M    | DOCS-001                       | Frontend         | Generate sidebar groups, active state, mobile navigation, previous/next links, and right-side TOC from metadata/headings.            |
| [x]    | DOCS-004   | M    | DOCS-001                       | Frontend         | Implement directory filters and status/category UI as progressively enhanced Solid islands with static fallback links.               |
| [x]    | DOCS-005   | S    | REG-003                        | Frontend         | Render install command, package/version/status, source files, dependencies, capabilities, and integrity metadata from registry only. |
| [x]    | DOCS-006   | S    | DOCS-002, I18N-003             | SEO/content      | Add structured data, canonical links, locale alternates, breadcrumbs, and social metadata for catalog pages.                         |
| [x]    | SEARCH-001 | S    | SITE-003                       | Search           | Separate Astro build from Pagefind indexing and expose explicit Nx `search-index` target.                                            |
| [x]    | SEARCH-002 | M    | SEARCH-001, SITE-005           | Search/frontend  | Build Solidiom command/search dialog; do not reuse corvu implementation or Pagefind default visual UI.                               |
| [x]    | SEARCH-003 | M    | SEARCH-002, REG-003            | Search           | Index/filter guides, catalog entries, APIs, examples, a11y, themes, blog, changelog, and migrations by content type and locale.      |
| [x]    | SEARCH-004 | S    | SEARCH-003                     | Accessibility/QA | Add keyboard, focus restoration, no-results, static fallback, and bilingual result tests.                                            |
| [x]    | SEARCH-005 | S    | SEARCH-003, GOV-004            | Privacy          | Emit only allowlisted search-open/result-selected events; never emit query text.                                                     |

### 6.5 Complex vertical slice

| Status | ID     | Size | Depends on                                 | Owner area       | Task and acceptance boundary                                                                                                                                  |
| ------ | ------ | ---- | ------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | VS-001 | L    | DOCS-001..006, API-001..005, A11Y-001..006 | Cross-functional | Complete Dialog end to end in English/Spanish, including live example, all static tabs, API, evidence, search, theme modes, and install metadata.             |
| [x]    | VS-002 | L    | VS-001                                     | Cross-functional | Complete Combobox end to end; prove complex state, keyboard model, collections, and API normalization.                                                        |
| [x]    | VS-003 | L    | VS-001                                     | Cross-functional | Complete Data Table end to end; prove adapters, large API, responsive preview, and data-boundary documentation.                                               |
| [x]    | VS-004 | M    | VS-001, VS-002, VS-003                     | QA/platform      | Add end-to-end vertical-slice gate: route counts, links, search, API snapshots, a11y artifacts, locale parity, visual/browser tests, and performance budgets. |

### G2 exit checklist

- [x] Registry v2 regenerates all current entries deterministically, **and** the committed output now matches source truth (`registry/index.json` carries `generatedAt: 2026-08-03T17:02:33Z`, after every catalog commit; `A11Y-009` closed and `BUILD-001` guards recurrence). Determinism and staleness are separate properties; both now hold.
- [x] Dialog, Combobox, and Data Table satisfy the M4 Primitive bar in both languages. `I18N-005` is closed — `translation:check` reports **0 stale, 0 missing, 0 GA blockers** and real source hashes throughout — but nothing has reached `translationStatus: human-reviewed`. That is the §8.1.2 G5 bar, not an M4 one.
- [x] API, a11y, search, routes, and translations are generated from canonical sources.
- [x] Numeric content/catalog performance budgets are enforced.
- [x] No bulk catalog work has bypassed the vertical-slice gate. `gate:vertical-slice` reports **67/67** with §9.1's rows at `[x]`, and the pass is now evidence: `VS-005` replaced the §11 regular expression over this document's raw text with a delegation to `PRIM-000`, which derives its count from the registry and content collections and asserts it against the declared tracker count. The old assertion counted complete-status primitive rows in prose as well as tables, so a sentence describing it could fail it; that is gone.

---

## 7. M3 — Public beta platform

### 7.1 Canonical recipes and CLI

`RECIPE-001` is complete; `docs/contracts/recipe-contract.md` is the normative reference and `docs/contracts/recipe-authoring-guide.md` is the authoring workflow. `RECIPE-002/003/004` are complete: the CSS, Tailwind, and UnoCSS emitters generate every **contract** recipe from `tools/recipe-contract-definitions.ts`, with `pnpm run recipe:emit:{css,tailwind,unocss}:check` enforced in `gate:phase1`. The contract shipped with 13 scopes (accordion, alert, badge, button, checkbox, dialog, menu, popover, select, switch, tabs, toast, tooltip) and `RECIPE-007` added typeset and prose, so it is **15 scopes × 3 profiles** today. `RECIPE-005/006` are complete: `tools/audit-recipe-parity.ts` asserts cross-profile coverage/state/exception parity and `tests/recipe-parity/` asserts computed-style parity for a rendered fixture; `tools/audit-package-source-parity.ts` and the `tests/package-source-parity` suite assert `src`/`source` byte parity and export-map completeness for all three recipe packages. All of these pass locally (`recipe:contract` reports 15 scopes valid; the three `:check` runs, `audit:recipe-parity`, `audit:package-source-parity`, and `test:recipe-parity` all exit 0).

**Typeset and prose are now inside the contract.** They shipped in two profiles only — `packages/recipes-css/src/styles/{typeset,prose}.css` and `packages/recipes-tailwind/src/recipes/typeset.tsx`, with no UnoCSS counterpart — and because the scopes were absent from `tools/recipe-contract-definitions.ts`, `audit:recipe-parity` compared only the 13 contract scopes and reported parity while the gap was open. `RECIPE-007` closed it: both are declared scopes, all three emitters generate them, and `packages/recipes-unocss/src/styles/` now carries `prose.css` and `typeset.css`. Two residual gaps remain under `RECIPE-008` (duplicated `@import`s in two profiles' `index.css`, and demos still only in the legacy `apps/docs`).

| Status | ID         | Size | Depends on               | Owner area        | Task and acceptance boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------ | ---------- | ---- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | RECIPE-001 | L    | REG-003                  | Design systems    | Define canonical recipe contract for semantic slots, variants, states, compound variants, scopes/parts, and adapter exceptions.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | RECIPE-002 | M    | RECIPE-001               | Design systems    | Implement CSS emitter and migrate existing CSS recipe metadata without behavior drift.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [x]    | RECIPE-003 | M    | RECIPE-001               | Design systems    | Implement Tailwind emitter and migrate existing recipes; generated output must match the canonical contract.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [x]    | RECIPE-004 | L    | RECIPE-001               | Design systems    | Implement UnoCSS emitter/preset; close the current gap where `recipes-unocss` has no equivalent recipe catalog.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | RECIPE-005 | M    | RECIPE-002..004          | QA/design systems | Extend recipe contract/dual-emission audits to three outputs, semantic slots, states, and documented exceptions.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [x]    | RECIPE-006 | S    | RECIPE-002..004          | Build             | Preserve `src/`/`source/` parity and package exports for recipe packages; add parity checks to CI.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| [x]    | CLI-001    | S    | —                        | CLI               | Establish canonical CLI source tree and update workflow for duplicated `src/` and `source/`; retain package-source parity.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [x]    | CLI-002    | M    | REG-003, CLI-001         | CLI               | Teach `plan`, `inspect`, and `add` about product-layer deliverables and styling outputs. Registry v2 `deliverables` unified to sorted `Deliverable[]`; schema extended; BUILTIN_PRIMITIVES marked offline-safe. Button carries a real component deliverable.                                                                                                                                                                                                                                                                                                  |
| [x]    | CLI-003    | M    | REG-006, CLI-002         | CLI/security      | Verified manifests/hashes gate source installs; lock/provenance records. In-repo verification complete (`verify-source.ts`, `lock.ts`, `PolicySchema`, `--allow-unverified`). `assert-no-unverified.ts` asserts zero `provenance: "unverified"` lock entries in the CI `build` job. **Registry index signing no longer runs in CI:** the step rewrote the committed `registry/index.json`, which `BUILD-001` then reported as stale, so it was removed in `77b5657`. Re-homing it to the release workflow and moving the index off HMAC is `REG-008` (§11.1). |
| [x]    | CLI-004    | M    | CLI-002, RECIPE-002..004 | CLI               | Source-owned component/block/theme install with destination, conflict, diff, and rollback. `destinations.ts`, `conflict.ts`, `rollback.ts`, `theme-install.ts` all delivered. UnoCSS profile documents manual wiring.                                                                                                                                                                                                                                                                                                                                         |
| [x]    | CLI-005    | M    | CLI-001                  | CLI               | Package-manager detection and normalized npm/pnpm/Yarn/Bun execution. Four managers × six operations, injection-safe `execFile`. `runAdd` is now async; `--install`/`--package-manager` flags added.                                                                                                                                                                                                                                                                                                                                                          |
| [x]    | CLI-006    | M    | CLI-005                  | CLI               | `solidiom create --template <name>` skeleton, destination safety, prompts, non-interactive flags, and cancellation cleanup. Placeholder scaffold later replaced by CLI-007's real materializer.                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | CLI-007    | L    | CLI-006, REG-003         | CLI/templates     | Template materialization, substitutions, config generation, dependency installation. Two templates: `vite-solid-router` and `tanstack-start-solid` (substituted for SolidStart per spike). EN+ES content entries. Prepack copy step not delivered.                                                                                                                                                                                                                                                                                                            |
| [x]    | CLI-008    | M    | CLI-007                  | QA/CLI            | Offline fixtures and smoke harness for all four package managers. Two-phase Verdaccio fixture, 8/8 combinations offline, two network leaks fixed, transitive-override defect fixed. Foreign lockfile enforced in materializer. CI matrix job with snapshot cache.                                                                                                                                                                                                                                                                                             |
| [x]    | CLI-009    | S    | CLI-002..008             | Documentation     | Bilingual CLI documentation: 10 EN + 10 ES guide pairs (`cli-recovery.md` absorbed `offline-install.md`; `registry-ownership.md` added by `MKT-005`). Commands/flags/packages untranslated. The staleness and protected-literal drift recorded here was fixed by `4aa1058` under `I18N-005`: all guides now carry current `translationSourceHash` values and pass the glossary and protected-literal checks. They remain `translationStatus: draft`, which is the §8.1.2 G5 bar.                                                                              |
| [x]    | CLI-010    | M    | CLI-002..008             | QA                | Command, AST, tamper, and parity test coverage. 25 test files / 300 tests. Gate §6 threshold raised 8→25. Gate §11 CLI command surface added (17 module existence checks + `requireVerifiedSource` wiring).                                                                                                                                                                                                                                                                                                                                                   |
| [ ]    | CLI-011    | S    | CLI-010, FOUND-002       | QA                | **Regression.** FOUND-002 bumped the registry to v3, but 5 CLI test files still create v2 fixtures. 33 of 300 tests fail with `RegistrySchemaError: Unsupported registry index schema version 2`. Affected: `registry.test.ts`, `verify-registry.test.ts`, `source-install.test.ts`, `verify-source.test.ts`, `add.test.ts`. Fix: update all test fixtures to v3 schema. Gate §6 CLI doctor check is red.                                                                                                                                                     |

### 7.2 Theme presets and builder foundation

| Status | ID          | Size | Depends on                   | Owner area           | Task and acceptance boundary                                                                                                                  |
| ------ | ----------- | ---- | ---------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | THEME-001   | M    | BRAND-002, RECIPE-001        | Design systems       | Define versioned semantic theme JSON schema, validation, migration, and light/dark requirements.                                              |
| [x]    | THEME-002   | M    | THEME-001                    | Design systems       | Generate CSS variables from canonical theme JSON.                                                                                             |
| [x]    | THEME-003   | M    | THEME-001                    | Design systems       | Generate Tailwind mapping from canonical theme JSON.                                                                                          |
| [x]    | THEME-004   | M    | THEME-001                    | Design systems       | Generate UnoCSS preset/configuration from canonical theme JSON.                                                                               |
| [x]    | THEME-005   | M    | THEME-002..004               | QA/design systems    | Add cross-output parity, contrast, required-token, and round-trip validation.                                                                 |
| [x]    | THEME-006   | L    | THEME-005, RECIPE-003        | Design systems       | Type scale added as 6 paired font-size/line-height identities (xs, sm, base, md, lg, xl) in canonical token model, emitted from all profiles. |
| [x]    | BUILDER-001 | M    | SITE-012, THEME-001          | Tools/frontend       | Create route-local Solid theme-builder shell with no imports in static route chunks.                                                          |
| [x]    | BUILDER-002 | L    | BUILDER-001                  | Tools/frontend       | Implement grouped token editor, validation messages, reset/undo, keyboard flow, and responsive UI.                                            |
| [x]    | BUILDER-003 | M    | BUILDER-001, required COMP-* | Tools/design systems | Implement representative component preview grid across light/dark and interaction states.                                                     |
| [x]    | BUILDER-004 | M    | THEME-002..004, BUILDER-002  | Tools                | Implement import/export for JSON, CSS, Tailwind, and UnoCSS with deterministic output.                                                        |
| [x]    | BUILDER-005 | M    | BUILDER-002                  | Tools/security       | Implement versioned URL-encoded share state with size limits, validation, malformed-input handling, and no server persistence.                |
| [x]    | BUILDER-006 | M    | BUILDER-001..005             | QA                   | Add accessibility, browser, privacy, visual, and route-bundle tests.                                                                          |

### 7.3 Beta gate

| Status | ID       | Size | Depends on                                           | Owner area          | Task and acceptance boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | -------- | ---- | ---------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | BETA-001 | M    | G2, representative COMP/BLOCK/TPL tasks, BUILDER-006 | Product/QA          | Define beta minimum coverage and publish maturity labels; no dead CTA or implied GA completeness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | BETA-002 | M    | BETA-001                                             | QA                  | Run beta acceptance matrix across locales, themes, browsers, search, CLI, tools, and accessibility.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [x]    | BETA-003 | S    | BETA-002, OPS-003                                    | Operations          | Publish public beta with rollback, incident contact, feedback path, and release notes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [x]    | A11Y-007 | L    | A11Y-005                                             | Accessibility       | Execute and record the manual evidence A11Y-005 defined: per-primitive assistive-technology records in `docs/at-audit-results/`, a keyboard audit in `docs/keyboard-audit-results.md`, and recorded tri-browser results. Artifacts: 52 AT records, `docs/keyboard-audit-results.md`, `docs/cross-browser-results.md`, `docs/axe-scan-results.md`; `gate:phase3` reports 21/21 locally. `phase3-gate` is a non-advisory `ci.yml` job, and it executed for the first time — green — in run `30871761546`; the mis-indentation that had broken the workflow was inside this very job (`CI-005`, §11.1, now closed).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [x]    | A11Y-008 | M    | BRAND-002                                            | Design systems/a11y | Raised `--sol-secondary` from `#3b82f6` (3.678:1) to `#2563eb` (Blue 600, 5.17:1) and dark-mode counterpart to `#60a5fa` (Blue 400) — both verified present in `apps/site/src/assets/tokens.css`. Extended `audit-theme-parity.ts` with `auditSiteTokenContrast()` to validate `apps/site/src/assets/tokens.css` `--sol-*` tokens against WCAG AA minimums. `audit:theme-parity` exits 0 locally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | TEST-005 | M    | TEST-003                                             | Visual QA           | **Correction:** the 36/36 local failure is a macOS-versus-Linux platform difference, not stale baselines. Local renders are byte-identical to the pre-`d53a53d` baselines — nothing about the site's rendering changed across the intervening commits. The committed baselines may well be correct; they have never been verified because `site-visual` has never run in CI (`CI-005`). Task redefined: set up the containerised visual harness (`mcr.microsoft.com/playwright:v1.61.1-noble`) so baselines are verifiable and approvable on any platform; observe one CI run of `site-visual`; approve or regenerate. Schedule after the last primitive lands, since 38 new pages will change `/primitives/`. **Closed.** The containerised harness ships as `tools/visual-container.sh` (`pnpm run visual:container` / `visual:update:container`, podman or docker) plus a dispatchable `.github/workflows/visual-baselines.yml` for contributors without a runtime. Baselines were recaptured in `mcr.microsoft.com/playwright:v1.61.1-noble`; all 36 differed from the macOS originals under byte comparison, confirming the platform diagnosis rather than inferring it. `site-visual` runs in that same image, passed in run `30871761546`, and is now blocking. Architecture turned out not to matter: baselines captured on arm64 Linux reproduced on amd64 CI, so matching distro, fontconfig, and freetype was sufficient. A `maxDiffPixelRatio` tolerance added earlier was reverted — it had been calibrated from a single unrepresentative 0.02 sample against a real spread of 0.04–0.09, and masked the platform mismatch rather than fixing it. |
| [x]    | TEST-006 | M    | TEST-002                                             | QA                  | Stabilize the intermittently-failing E2E tests on search keyboard nav, mobile drawer, and theme toggle. Re-verified for this update: `apps/site` E2E is **435/435 passing** in a single full run across Chromium, Firefox, WebKit, and the two mobile projects (2.4 min). The original row's "310/310" predates suite growth.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

#### BETA-002 status

`BETA-002` is **complete**, and both halves were re-run against the current tree for this update:

- `beta:acceptance:report` — 60/60 (14 route existence, 45 locale parity, 1 search index), gate passed.
- `beta:acceptance:e2e` — **111/111**, not the 74/74 previously recorded. `tests/beta-acceptance/playwright.config.ts` declares three projects (chromium, firefox, **webkit**), so the 37 checks run three times. The earlier figure omitted WebKit. Coverage: locale parity, theme modes, search, tools, and axe-core `no_critical_violations`.

History, since the reasoning is worth keeping: 12 of the original 111 checks failed `color-contrast` because `--sol-secondary` was `#3b82f6` (3.678:1 on `#ffffff`), below the 4.5:1 AA floor for normal text, and that token is the site's link colour, so every audited route reported it. It escaped `THEME-005`'s contrast matrix because that audit validates the **theme contract** (`solidiom-default`), not the site's `--sol-*` set, which is `BRAND-002`'s namespace. `A11Y-008` fixed the value and closed the coverage gap; both are verified in the current tree.

Two defects found alongside it were fixed rather than tracked, since neither needed a design decision. Both are verified still fixed:

- `BetaBanner.tsx` carried `role="banner"` on a `div` while the shell `<header>` already owns that landmark, producing two banner landmarks and failing `landmarks_present`. The role is removed, and the file now carries a comment recording why.
- `apps/site/tests/e2e/shell-a11y.spec.ts` had been changed from `toHaveCount(1)` to `toHaveCount(2)` banners (commit `1930bfc`, "resolve remaining CI failures") to accommodate that defect rather than fix it. It asserts `toHaveCount(1)` again, per SITE-011.

**Enforcement status.** `beta-acceptance-report` and `beta-acceptance-e2e` are `ci.yml` jobs and both ran green in run `30871761546`. `CI-007` is closed: `beta-acceptance-e2e` is blocking (`site-lighthouse` is the only `continue-on-error` job left in the workflow) and its inline comment no longer describes the pre-`A11Y-008` contrast failures as current.

### G3 exit checklist

Every line below was re-verified by running the named command locally, and as of run `30871761546` all of them are also enforced by an observed CI run. The earlier wording — that the workflow had been unparseable for the whole period in which these rows closed, so nothing re-checked them — is kept in `CI-005` (§11.1) because the lesson still matters. Note the observed run is at `079512e`, not `HEAD`; see the banner in §0.

- [x] Canonical recipe contract and all three emitters ship every contract recipe scope from one definition (`RECIPE-001`..`006`; `recipe:contract` validates **15** scopes — the original 13 plus typeset and prose from `RECIPE-007` — and all three `recipe:emit:*:check` exit 0). Two residual typeset gaps remain under `RECIPE-008`.
- [x] Theme contract, generation, and cross-output parity/contrast/round-trip audits pass (`THEME-001`..`006`; `theme:emit:{css,tailwind,unocss}:check` and `audit:theme-parity` exit 0).
- [x] CLI covers plan/inspect/add/create with verified manifests, conflict/diff/rollback, four package managers, and offline fixtures (`CLI-001`..`010`; `gate:phase1`'s CLI command surface section passes 18/18).
- [x] Theme-builder shell, editor, preview grid, import/export, and share state ship behind route-local boundaries (`BUILDER-001`..`006`; `apps/site` `boundaries` passes in `site-check`).
- [x] Beta minimum coverage and maturity labels are published with no dead CTA (`BETA-001`; `docs/contracts/beta-coverage-matrix.md`).
- [x] Static-build acceptance evidence passes (`beta:acceptance:report`, 60/60).
- [x] Cross-browser acceptance matrix passes (`beta:acceptance:e2e`, 111/111 across Chromium, Firefox, WebKit).
- [x] Manual accessibility evidence is recorded and `gate:phase3` passes (`A11Y-007`: 52 AT records in `docs/at-audit-results/`, `docs/keyboard-audit-results.md`, `docs/cross-browser-results.md`, `docs/axe-scan-results.md`; `gate:phase3` reports 21/21 including a full re-run of the phase 0/1/2 gates, and `gate:phase1` reports 252/252).
- [x] Public beta is published with rollback, incident contact, feedback path, and release notes (`BETA-003`; `docs/releases/beta-2026-08-01.md`).

#### Accepted limitations at G3

Recorded rather than left implicit, per global Definition of Done rule 1. Each has an owner. Only `QA-004` and `I18N-005`'s G5 half remain open at G3; the struck-through rows are kept as a record of what was wrong and how it was found.

| Limitation                                                                                                                                                                                                                                                                                                                                                                                  | Owner        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| ~~No CI job had ever run.~~ **Resolved:** ci.yml parses, format passes, all jobs load. Awaiting first observed GitHub Actions run.                                                                                                                                                                                                                                                          | `CI-005`     |
| ~~Visual-regression evidence unverifiable; `site-visual` never ran.~~ **Resolved:** the job runs in `mcr.microsoft.com/playwright:v1.61.1-noble`, baselines were recaptured in that image, and it passed in run `30871761546`. Now blocking.                                                                                                                                                | `TEST-005`   |
| `site-lighthouse` remains advisory; performance budgets are defined but not enforced for the site.                                                                                                                                                                                                                                                                                          | `QA-004`     |
| No content in the repository has reached `translationStatus: human-reviewed`. `translation:check` reports **0 human-reviewed, 171 draft, 0 stale, 0 missing, 0 GA blockers** — the staleness and terminology drift is fixed (`I18N-005` closed), but human review is the §8.1.2 G5 bar and no item has cleared it, so §8.5 is unmet everywhere and, being report-only below GA, unenforced. | `I18N-005`   |
| ~~Typeset/prose outside contract.~~ **Resolved:** RECIPE-007 added typeset (5 slots) and prose (1 slot) to the canonical contract; all three emitters pass. Two residual gaps tracked as `RECIPE-008`: duplicated `@import`s in two profiles' `index.css`, and demos still only in the legacy `apps/docs`.                                                                                  | `RECIPE-007` |
| ~~Registry stale.~~ **Resolved:** A11Y-009 committed all 52 evidence files and rebuilt the registry. BUILD-001 staleness guard prevents recurrence.                                                                                                                                                                                                                                         | `A11Y-009`   |
| ~~132 files fail prettier.~~ **Resolved:** CI-006 fixed the generator and ran `pnpm format`.                                                                                                                                                                                                                                                                                                | `CI-006`     |

`THEME-006` is no longer a limitation: the type scale is now six paired `font-size`/`line-height` identities in `tools/recipe-contract-tokens.ts` with `css`/`tailwind`/`unocss`/`site` mappings, materialized as `--sol-font-size-*` / `--sol-line-height-*` in `apps/site/src/assets/tokens.css` and as `font-size-*` in `tools/theme-contract-definitions.ts`.

`TEST-006` is no longer a limitation on the evidence available: a full 435-test run passed with no retries. Treat a single red run as a signal to re-run before filing, not as proof of a defect.

`QA-003` at G4 may now inherit visual evidence as passing: `TEST-005` is closed, `site-visual` is blocking, and its baselines are reproducible in a pinned image rather than on one contributor's machine.

---

## 8. Shared catalog-item Definitions of Done

Each layer's DoD is tiered into a machine-checkable bar and a review bar, and each machine-checkable clause is numbered so the enforcing gate can cite it in source. `primitive-catalog-gate.ts` already does this for §8.1.1 at nine sites; `FOUND-004` and `FOUND-005` do the same for §8.2.1 and §8.3.1. The numbering is the binding device: a requirement added here without a gate clause, or a gate clause with no requirement here, shows up as a mismatch in review instead of drifting quietly.

Where a decision produced one of these requirements, the rationale — options considered, alternatives rejected — lives in `docs/plans/task-sequencing.md` §3. This section states the rule; that one states why the rule reads as it does. Neither restates the other.

### 8.1 Primitive item DoD

The primitive DoD is tiered. The **M4 bar** is machine-checkable by `PRIM-000` (`tools/primitive-catalog-gate.ts`); the **G5 bar** adds the human requirements that arm the existing enforcement gates.

#### 8.1.1 M4 bar (enforced by `PRIM-000`)

A `PRIM-*` row may go `[x]` when all nine hold:

1. Registry records `documentation.status: "complete"` and `accessibility.reviewStatus: "automated"` with ≥1 evidence ID, carries bilingual search keywords and current integrity data, **and the committed registry matches source truth**.
2. English overview contains the required sections: Usage, Installation, Parts & Props, Styling, SSR and hydration, Keyboard & behavior.
3. Conditional sections are present **or** declared `notApplicable` with a stated reason: Composition, Relationships, Migration notes, Testing. `PRIM-000` accepts a declared reason the same way `a11y:coverage-gate` accepts non-applicable accessibility criteria.
4. Spanish mirrors 2 and 3, carries `translationStatus: draft` and a real `translationSourceHash`, and passes the glossary and protected-literal checks in `translation:check`.
5. At least one example. `runnable: true` with a live Solid island **if and only if** the accessibility contract declares keyboard interaction; otherwise `runnable: false` with a declared reason. The discriminator is derived from an authored artifact rather than listed, so no separate list can drift.
6. Authored accessibility contract in English and Spanish, per the `A11Y-002` schema.
7. Committed `packages/<name>/docs/accessibility/evidence.json` with a passing summary and `passes > 0`.
8. API artifact present and source-linked; all four routes render in both locales.
9. Registry `status` remains `preview`.

#### 8.1.2 G5 bar (per-primitive promotion)

Per primitive, in order: Spanish flips to `translationStatus: human-reviewed` → registry `status` moves to `stable`. That step arms two existing gates for that primitive automatically:

- `a11y:coverage-gate` enforces only where `status` is `stable`.
- `validate-translation-freshness.ts` derives GA maturity from the same field and blocks on anything not `human-reviewed`.

No new enforcement mechanism is needed at G5; promotion _is_ the enforcement.

Additionally, the full manual evidence matrix from `A11Y-005` must be recorded per primitive before `stable` is granted — including keyboard, focus, zoom, contrast, reduced motion, screen readers, and touch.

### 8.2 Component item DoD

Tiered like §8.1. The **M4 bar** is machine-checkable by `FOUND-004` (`tools/component-catalog-gate.ts`); the **review bar** holds what only a human can judge. `FOUND-004` cites these clause numbers in source — `// §8.2 req N` — the way `primitive-catalog-gate.ts` cites §8.1.1, so an edit here without a corresponding gate edit is visible in review rather than silent.

Decision rationale for requirements 1, 4, and 5 lives in `docs/plans/task-sequencing.md` §3 (D1, D2, D3). This section is normative; that one records why.

**Utility stylesheets excluded.** `typeset` and `prose` are typography utility stylesheets, not
components. They have no primitive dependency, no interactive behavior, and no slot composition.
Their styling is emitted as `styles/typeset.css` and `styles/prose.css` in all three profiles.
`recipes-tailwind` additionally exports a convenience class-string map as `recipes/typeset.tsx`,
but this does not constitute a component wrapper under D1(b). Neither `typeset` nor `prose`
appears in the component catalog or the `COMP-*` queue.

#### 8.2.1 M4 bar (enforced by `FOUND-004`)

A `COMP-*` row may go `[x]` when all ten hold:

1. **Physical form.** The component is the composed recipe wrapper for each shipped styling profile — `packages/recipes-<profile>/src/recipes/<scope>.tsx` — plus its primitive dependency. The wrapper imports the corresponding `@solidiom/<primitive>` package and contributes styling and composition only.
2. **Canonical contract.** The scope is declared in `tools/recipe-contract-definitions.ts` and validated by `recipe:contract`.
3. **Three outputs, no fork.** `recipe:emit:{css,tailwind,unocss}:check` all pass for the scope, `audit:recipe-parity` reports cross-profile coverage/state/exception parity, and `audit:recipe-drift` is green — a pre-existing CSS or Tailwind recipe is migrated into the contract, never forked beside it.
4. **Registry.** `registry/components/<name>.json` exists with source files recorded **per styling output**, integrity digests, and `documentation.status: "complete"`; the component appears in the index's `components[]`.
5. **Source install.** `solidiom plan`/`add`/`verify`/`diff` resolve the component to the wrapper for `config.stylingProfile` rather than to primitive files, write a verified lock entry, and fail closed on a digest mismatch.
6. **English docs** at `apps/site/src/content/en/components/<name>.md` containing the required sections: Usage, Installation, Anatomy, Variants & states, Styling, SSR and hydration, Accessibility. `FOUND-006`'s scaffolder emits exactly this list and `FOUND-004` enforces it, so a section is added in one place.
7. **Spanish mirror** of 6 with `translationStatus: draft`, a real `translationSourceHash`, and passing glossary and protected-literal checks in `translation:check`.
8. **At least one example**, extracted per `CONTENT-005` so the displayed code and the executable example share one canonical source.
9. **Accessibility by reference.** The docs cite the primitive's authored contract and its committed `evidence.json` rather than restating them, and that evidence passes with `passes > 0`. A component-level note is required only where the wrapper changes semantics.
10. **Routes.** `/components/<name>/` renders in both locales and `REG-007` reports exactly one route for the deliverable. Registry `status` remains `preview`.

#### 8.2.2 Review bar (human)

- The wrapper introduces no duplicate behavior layer: no state machine, focus management, or keyboard handling that the primitive already owns.
- Tests cover states, variants, slots, composition, and disabled/loading/error behavior adequately — presence of a passing suite is req 3's business; sufficiency is this one's.
- Theme previews render correctly across all four presets in light and dark.
- Spanish human review per §8.5, which is a G5 requirement and does not hold an M4 row.

### 8.3 Block item DoD

Tiered as above. The **M4 bar** is machine-checkable by `FOUND-005` (`tools/block-catalog-gate.ts`), which cites these clause numbers in source. Rationale for requirements 3 and 4 is in `task-sequencing.md` §3 (D4, D6).

#### 8.3.1 M4 bar (enforced by `FOUND-005`)

A `BLOCK-*` row may go `[x]` when all ten hold:

1. **Named, not reserved.** The block carries its `BLOCK-000` name, outcome, and data boundary in `docs/contracts/block-catalog-manifest.json`; no placeholder ships.
2. **Dependencies resolve by name.** Every `componentDependencies` entry resolves to an approved `COMP-001..030` row **and** the component named for that ID in `block-catalog-manifest.md` matches the name §9.2 gives it; every one of those rows is complete. An ID-range check alone is insufficient and was demonstrably so: ten citations once used `PRIM-*` numbers with a `COMP-` prefix, and the two that happened to land inside `001..021` resolved cleanly to the wrong component in 20 blocks.
3. **No unresolved proposals.** `proposedComponents` is empty for this block, or the §9.2 amendment that absorbs it is recorded.
4. **Structured states.** `requiredStates` declares all four of `loading`, `empty`, `error`, `restricted`, and matches the prose `states` field in cardinality.
5. **States implemented.** All four are implemented in source, not merely declared.
6. **Both previews.** Full-page and embedded previews exist and render.
7. **Registry.** `registry/blocks/<name>.json` exists with integrity digests; the block appears in the index's `blocks[]`.
8. **Source install.** `solidiom add`/`verify`/`diff` resolve and verify the block source, and fail closed on a digest mismatch.
9. **Bilingual docs.** English doc with its required sections plus a Spanish mirror at `translationStatus: draft` with a real hash, passing `translation:check`. The docs state the primitive/component dependency map, the files and routes added, and the data-boundary assumptions explicitly.
10. **Routes.** `/blocks/<name>/` renders in both locales and `REG-007` reports exactly one route.

#### 8.3.2 Review bar (human)

- Responsive and mobile behavior reviewed at the three visual breakpoints, with baselines approved through `TEST-005`'s container harness.
- Data-boundary assumptions reviewed: the block assumes no backend contract its docs do not state.
- Keyboard path through the block reviewed end to end, and axe reports no critical violations on the preview route.
- Canonical recipes generate the CSS/Tailwind/UnoCSS forms where the block introduces styling of its own.

### 8.4 Template item DoD

Tiered as above, with one caveat: **no template gate exists in §9.0.** The M4 bar below is enforced by the `TPL-000` manifest validator, which `TPL-000` must produce as part of approving the manifest, plus the existing `CLI-008` offline smoke matrix. Until that validator lands, §8.4.1 is review-enforced and should be treated as such rather than as checked.

#### 8.4.1 M4 bar (enforced by the `TPL-000` validator + `CLI-008`)

A `TPL-*` row may go `[x]` when all eight hold:

1. **One stack.** Listed in the `TPL-000` manifest targeting exactly one of SolidStart, TanStack Start Solid, or Vite + Solid Router, with `requiredBlocks`, deployment target, auth model, and portfolio tags declared.
2. **Tree present.** `templates/<name>/` exists with a `template.json` following the two `CLI-007` references.
3. **Four package managers.** `solidiom create --template <name>` succeeds with npm, pnpm, Yarn, and Bun in the `CLI-008` offline fixture, with no foreign lockfile in the result.
4. **Generated project is live.** It builds, typechecks, and starts.
5. **Generated project is tested.** It passes its smoke and accessibility tests inside the offline fixture.
6. **Blocks complete.** Every `requiredBlocks` entry is a complete `BLOCK-*` row.
7. **Registry.** `registry/templates/<name>.json` exists with integrity digests and a signed manifest; the template appears in the index's `templates[]`.
8. **Bilingual docs and route.** English doc plus Spanish mirror at `translationStatus: draft` with a real hash, and `/templates/<name>/` renders in both locales.

#### 8.4.2 Review bar (human)

- Replaceable boundaries documented: which files a consumer is expected to edit, and which are scaffolding.
- Router, data fetching, authn/authz, styling, theme, and package-manager choices stated with their rationale.
- Security and data assumptions stated; screenshots current.
- Shared portfolio concepts use one canonical template unless a materially different architecture is approved.

### 8.5 Translation item DoD

This is the **G5** translation requirement per §8.1.2. It applies when promoting a primitive to `stable`, not at M4 closure.

- English source hash matches the reviewed Spanish translation record.
- A fluent human reviewer confirms terminology, technical meaning, accessibility guidance, metadata, and examples.
- Code, APIs, commands, attributes, and package names are not translated.
- Route parity, links, search inclusion, canonical/`hreflang`, and layout stress tests pass.

---

## 9. M4 — Catalog completion work queues

Sequencing for the 86 open component, block, and template items is owned by `docs/plans/task-sequencing.md`, which resolves the six design decisions those layers depend on (component physical form, registry v3 shape and paths, docs location, block state vocabulary, CSS class prefixes, and `proposedComponents` policy) and derives the component order from the real block dependency graph. That document owns the sequence and the decisions; this one owns status. §9.0 below carries the foundation rows it defines.

### 9.0 Catalog machinery — prerequisites for §§9.2–9.5

No `COMP-*`, `BLOCK-*`, or `TPL-*` row can start until these land. They are shared across all four non-primitive layers, which is why they are not inside any one queue table. Sizes, ordering, and the full rationale are in `docs/plans/task-sequencing.md` §4; the D1–D6 resolutions are in its §3.

The gap these close: the layers below have no implementation layer at all. The registry index carries only `primitives` and `adapters`; `registry-build.ts` discovers only `layer:primitive`-tagged packages and deletes any manifest it did not write; `install.ts` resolves component source to _primitive_ files regardless of deliverable; the `components`, `blocks`, and `themes` content collections are empty; there is no route generator and no gate for any of the four. §9.2 sat at `[ ]` × 21 with none of this noticed because no gate could fail.

`FOUND-001` is closed: §8.2/§8.3/§8.4 now carry numbered machine-checkable bars for `FOUND-004` and `FOUND-005` to cite. Note what that does **not** mean — a requirement written in §8 with no gate clause behind it is still unenforced prose. The clause numbering makes that visible in review; `FOUND-004` and `FOUND-005` are what make it fail.

| Status | ID        | Size | Depends on           | Owner area        | Task and acceptance boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------ | --------- | ---- | -------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | FOUND-001 | S    | —                    | Governance/plan   | Fold D1–D6 into the DoDs. **Done:** §8.2, §8.3, and §8.4 are tiered into numbered machine-checkable bars plus review bars, mirroring §8.1, and the block manifest's `resolution.decision` — which cited `docs/plans/primitives.md §2 decision 13`, deleted in `e0fa091` — now points at `task-sequencing.md` §3 (D6). Enforcement is `FOUND-004` (§8.2.1) and `FOUND-005` (§8.3.1), citing clause numbers in source as `primitive-catalog-gate.ts` does for §8.1.1. §8.4.1 has no gate until `TPL-000` produces a manifest validator, and is review-enforced until then.            |
| [x]    | FOUND-002 | L    | FOUND-001            | Registry/platform | Registry v3: `components[]`/`blocks[]`/`templates[]`/`themes[]` in the index, namespaced manifests under `registry/<layer>/`, layer-aware discovery and `documentationMetadata()`. Also updates the pinned CLI index version, the 2513-line build snapshot, REG-006's verify path, the orphan sweep, and `.prettierignore`. See §4.1.                                                                                                                                                                                                                                               |
| [x]    | FOUND-003 | S    | FOUND-001            | CLI               | `install.ts` resolves component and block source per D1 — the recipe wrapper for `config.stylingProfile` — instead of always resolving primitive files. Verify → conflict → rollback → lock ordering unchanged.                                                                                                                                                                                                                                                                                                                                                                     |
| [x]    | FOUND-004 | M    | FOUND-002            | QA/platform       | `tools/component-catalog-gate.ts`: per-item §8.2 checks, registry reconciliation, `--audit-only`, and a ratchet asserting the passing count equals the `Components` DoD column in §11's scope counters. Mirrors `PRIM-000`.                                                                                                                                                                                                                                                                                                                                                         |
| [x]    | FOUND-005 | S    | FOUND-002            | QA/product        | `tools/block-catalog-gate.ts` + manifest validator: `componentDependencies` resolve to `COMP-001..030` **by name, not only by ID range** — the gate must parse the names from `block-catalog-manifest.md` and assert they match both the IDs in the `.json` and §9.2's table, since disagreement between those three is exactly what nothing checked and what let ten misnumbered citations through. Also: `requiredStates` present, complete, and cardinality-matched against prose `states`; `proposedComponents` empty for any started block row. Ratchets the `Blocks` counter. |
| [x]    | FOUND-006 | S    | FOUND-002            | Content platform  | `tools/scaffold-catalog-docs.ts` emitting EN+ES stubs into `apps/site/src/content/{en,es}/{components,blocks,templates,themes}/` with real `translationSourceHash` values — never the 64-zero placeholder that caused `I18N-005`.                                                                                                                                                                                                                                                                                                                                                   |
| [x]    | FOUND-007 | M    | FOUND-002            | Frontend          | Route generators for `/components/[name]/`, `/blocks/[name]/`, `/templates/[name]/`, `/themes/[name]/` in both locales, satisfying REG-007's one-deliverable-one-route invariant. `apps/site/src/pages/themes/` currently holds only `builder/`.                                                                                                                                                                                                                                                                                                                                    |
| [x]    | FOUND-008 | S    | FOUND-004, FOUND-005 | Build/CI          | `recipe-emit-css.ts` derives `solidiom-<scope>` by default, keeping `CLASS_PREFIXES` for exceptions only, so the emitter can no longer throw on a missing prefix. D5 applied to all three emitters (CSS, Tailwind, UnoCSS). Wired the new gates into `ci.yml` as the `catalog-gates` job and into `phase1-gate.ts` §15 — cited by title, not number, per §3.1.                                                                                                                                                                                                                      |
| [x]    | FOUND-009 | S    | FOUND-001            | Design systems    | Close or except the wrapper asymmetry D1 inherits: `recipes-tailwind` carries a 14th wrapper (`typeset.tsx`) that `recipes-css` and `recipes-unocss` lack, so "a component is the recipe wrapper" is not uniformly true. Finished `RECIPE-008`(a) or recorded the exception in §8.2.                                                                                                                                                                                                                                                                                                |

**Phase 0 total: 20–26 person-days.** `FOUND-002` is on the critical path for three others.

### 9.1 Primitive queue — 52

All tasks depend on `VS-004`. Dialog, Combobox, and Data Table may close from their vertical-slice work once the full Primitive DoD passes.

**All 52 primitives now pass the M4 bar** (§8.1.1), enforced by `PRIM-000` (`tools/primitive-catalog-gate.ts`), which asserts a ratcheting count of 52 against the `DoD` column in §11. Each primitive has an EN + ES `overview.md` with the required sections, one EN + ES example, an EN + ES accessibility contract under `packages/<name>/docs/`, a generated API artifact (`artifacts/api/*.json`), a registry manifest with integrity digests, generated `/primitives/<name>/{,api,examples,accessibility}/` routes in both locales, and a committed `docs/accessibility/evidence.json` with `passes > 0`.

The two requirements that previously held this section open are both closed:

- **The registry matches source truth.** It had been generated `2026-07-31T05:34:08Z`, before any catalog commit, recording `documentation.status: "stub"` or `"draft"` and `reviewStatus: "none"` for the eleven M4 primitives. `A11Y-009` committed all 52 `evidence.json` files and rebuilt the registry (`generatedAt: 2026-08-03T17:02:33Z`), and `BUILD-001` now fails CI when a build or generator dirties the tree, so the shipped artifact cannot silently drift from source again. Note the recurrence guard is `BUILD-001` plus `PRIM-000`'s evidence assertions, **not** a widened `a11y:coverage-gate` — that gate still fires only on `status: "stable"`, of which there are currently zero.
- **Spanish carries real hashes and passes terminology checks.** `translation:check` reports 0 stale, 0 missing, and 0 GA blockers; the placeholder `translationSourceHash` values of 64 zeros are gone (`I18N-005`). All 171 records are `translationStatus: draft`. Human review is the §8.1.2 G5 bar, not an M4 requirement, so it does not hold these rows.

Separately, per-primitive visual checks are not part of the M4 bar (§8.1.1). The visual matrix captures three fixed pages (`/`, `/primitives/`, a 404), not per-primitive views. `TEST-005` applies to the site shell rather than to individual primitives; it is closed, and its baselines were recaptured after the last primitive landed.

`PRIM-000` (`tools/primitive-catalog-gate.ts`) enforces all nine requirements of the M4 bar and asserts a ratcheting count of 52. `VS-005` is resolved: the vertical-slice gate now delegates to PRIM-000 instead of grepping this file.

| Status | ID       | Primitive        | Size | Depends on     |
| ------ | -------- | ---------------- | ---- | -------------- |
| [x]    | PRIM-001 | Accordion        | M    | VS-004         |
| [x]    | PRIM-002 | Alert            | M    | VS-004         |
| [x]    | PRIM-003 | Alert Dialog     | M    | VS-004         |
| [x]    | PRIM-004 | Avatar           | M    | VS-004         |
| [x]    | PRIM-005 | Badge            | M    | VS-004         |
| [x]    | PRIM-006 | Breadcrumb       | M    | VS-004         |
| [x]    | PRIM-007 | Button           | M    | VS-004         |
| [x]    | PRIM-008 | Calendar         | L    | VS-004         |
| [x]    | PRIM-009 | Card             | M    | VS-004         |
| [x]    | PRIM-010 | Carousel         | L    | VS-004         |
| [x]    | PRIM-011 | Checkbox         | M    | VS-004         |
| [x]    | PRIM-012 | Collapsible      | M    | VS-004         |
| [x]    | PRIM-013 | Combobox         | L    | VS-002, VS-004 |
| [x]    | PRIM-014 | Command Palette  | L    | VS-004         |
| [x]    | PRIM-015 | Context Menu     | L    | VS-004         |
| [x]    | PRIM-016 | Data Table       | L    | VS-003, VS-004 |
| [x]    | PRIM-017 | Date Picker      | L    | VS-004         |
| [x]    | PRIM-018 | Dialog           | L    | VS-001, VS-004 |
| [x]    | PRIM-019 | Drawer           | L    | VS-004         |
| [x]    | PRIM-020 | Empty State      | M    | VS-004         |
| [x]    | PRIM-021 | Field            | M    | VS-004         |
| [x]    | PRIM-022 | Hover Card       | M    | VS-004         |
| [x]    | PRIM-023 | Input            | M    | VS-004         |
| [x]    | PRIM-024 | Input OTP        | L    | VS-004         |
| [x]    | PRIM-025 | Kbd              | S    | VS-004         |
| [x]    | PRIM-026 | Label            | S    | VS-004         |
| [x]    | PRIM-027 | Listbox          | L    | VS-004         |
| [x]    | PRIM-028 | Menu             | L    | VS-004         |
| [x]    | PRIM-029 | Meter            | M    | VS-004         |
| [x]    | PRIM-030 | Navigation Menu  | L    | VS-004         |
| [x]    | PRIM-031 | Pagination       | M    | VS-004         |
| [x]    | PRIM-032 | Popover          | M    | VS-004         |
| [x]    | PRIM-033 | Progress         | M    | VS-004         |
| [x]    | PRIM-034 | Radio Group      | M    | VS-004         |
| [x]    | PRIM-035 | Resizable Panels | L    | VS-004         |
| [x]    | PRIM-036 | Scroll Area      | M    | VS-004         |
| [x]    | PRIM-037 | Select           | L    | VS-004         |
| [x]    | PRIM-038 | Separator        | S    | VS-004         |
| [x]    | PRIM-039 | Sheet            | L    | VS-004         |
| [x]    | PRIM-040 | Skeleton         | M    | VS-004         |
| [x]    | PRIM-041 | Slider           | L    | VS-004         |
| [x]    | PRIM-042 | Spinner          | M    | VS-004         |
| [x]    | PRIM-043 | Switch           | M    | VS-004         |
| [x]    | PRIM-044 | Tabs             | M    | VS-004         |
| [x]    | PRIM-045 | Toast            | L    | VS-004         |
| [x]    | PRIM-046 | Toggle           | M    | VS-004         |
| [x]    | PRIM-047 | Toggle Group     | M    | VS-004         |
| [x]    | PRIM-048 | Toolbar          | L    | VS-004         |
| [x]    | PRIM-049 | Tooltip          | M    | VS-004         |
| [x]    | PRIM-050 | Tree             | L    | VS-004         |
| [x]    | PRIM-051 | Virtual List     | L    | VS-004         |
| [x]    | PRIM-052 | Visually Hidden  | S    | VS-004         |

`PRIM-013`, `PRIM-016`, and `PRIM-018` closed from the vertical slice, which gave Dialog, Combobox, and Data Table their pages, examples, contracts, and a committed `evidence.json` before the retrofit queue began. Their registry entries have read `documentation.status: "complete"` / `reviewStatus: "automated"` throughout, so `A11Y-009` never applied to them.

### 9.2 Component queue — 30

**All 30 rows additionally depend on §9.0** — the `Depends on` column below predates it and lists only the recipe/primitive/theme prerequisites. `Baseline` describes current recipe evidence, not completion. Existing recipes must migrate to the canonical contract and add UnoCSS. Order is not the table order: `docs/plans/task-sequencing.md` §5–6 sequences these by block fanout, opening with a three-item vertical slice (Button, Input, Dialog) before any fan-out, for the same reason §9.1 forbade bulk primitive work before `VS-004`.

**Extended from 21 to 30.** `COMP-022`..`030` were added because the approved block catalog depends on nine components the queue never listed. They were hiding in plain sight: ten citations in `block-catalog-manifest.json` used `PRIM-*` numbers with a `COMP-` prefix, and `BLOCK-000A` had filed the eight that fell outside `001..021` as unresolvable "proposed" IDs rather than reading their names out of the manifest's own `.md` companion, which had them all along. Corrected, they resolve to Command Palette, Data Table, Kbd, Meter, Progress, Resizable Panels, Scroll Area, Spinner, and Toolbar — plus a tenth, `COMP-043` Switch, which was simply a second identity for `COMP-015`. Spinner is required by **all 36** blocks and Data Table by 19, so this is not a long-tail addition.

**Renumbering hazard.** `COMP-025` and `COMP-029` previously appeared in the manifest as misnumbered citations meaning **Kbd** and **Meter**. They now mean **Meter** and **Spinner**. Nothing in the tree still carries the old sense — the manifest was rewritten and `proposedComponents` is empty — but a reader of an older revision or of the `BLOCK-000A` commit will meet the old meaning, so check the name, never the number alone.

| Status | ID       | Component        | Baseline               | Size | Depends on                      |
| ------ | -------- | ---------------- | ---------------------- | ---- | ------------------------------- |
| [ ]    | COMP-001 | Button           | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-007, THEME-006 |
| [ ]    | COMP-002 | Input            | New                    | M    | RECIPE-005, PRIM-023            |
| [ ]    | COMP-003 | Field            | New                    | L    | RECIPE-005, PRIM-021, COMP-002  |
| [ ]    | COMP-004 | Card             | New                    | M    | RECIPE-005, PRIM-009            |
| [ ]    | COMP-005 | Alert            | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-002            |
| [ ]    | COMP-006 | Dialog           | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-018            |
| [ ]    | COMP-007 | Select           | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-037            |
| [ ]    | COMP-008 | Dropdown Menu    | Existing `menu` recipe | L    | RECIPE-005, PRIM-028            |
| [ ]    | COMP-009 | Tabs             | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-044            |
| [ ]    | COMP-010 | Toast            | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-045            |
| [ ]    | COMP-011 | Tooltip          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-049            |
| [ ]    | COMP-012 | Avatar           | New                    | M    | RECIPE-005, PRIM-004            |
| [ ]    | COMP-013 | Checkbox         | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-011            |
| [ ]    | COMP-014 | Radio Group      | New                    | M    | RECIPE-005, PRIM-034            |
| [ ]    | COMP-015 | Switch           | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-043            |
| [ ]    | COMP-016 | Combobox         | New                    | L    | RECIPE-005, PRIM-013            |
| [ ]    | COMP-017 | Popover          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-032            |
| [ ]    | COMP-018 | Sheet            | New                    | L    | RECIPE-005, PRIM-039            |
| [ ]    | COMP-019 | Navigation Menu  | New                    | L    | RECIPE-005, PRIM-030            |
| [ ]    | COMP-020 | Breadcrumb       | New                    | M    | RECIPE-005, PRIM-006            |
| [ ]    | COMP-021 | Pagination       | New                    | M    | RECIPE-005, PRIM-031            |
| [ ]    | COMP-022 | Command Palette  | New                    | L    | RECIPE-005, PRIM-014            |
| [ ]    | COMP-023 | Data Table       | New                    | L    | RECIPE-005, PRIM-016            |
| [ ]    | COMP-024 | Kbd              | New                    | S    | RECIPE-005, PRIM-025            |
| [ ]    | COMP-025 | Meter            | New                    | M    | RECIPE-005, PRIM-029            |
| [ ]    | COMP-026 | Progress         | New                    | M    | RECIPE-005, PRIM-033            |
| [ ]    | COMP-027 | Resizable Panels | New                    | L    | RECIPE-005, PRIM-035            |
| [ ]    | COMP-028 | Scroll Area      | New                    | M    | RECIPE-005, PRIM-036            |
| [ ]    | COMP-029 | Spinner          | New                    | M    | RECIPE-005, PRIM-042            |
| [ ]    | COMP-030 | Toolbar          | New                    | L    | RECIPE-005, PRIM-048            |

**Two components have zero consumers.** With the citations corrected, `COMP-016` (Combobox) and `COMP-018` (Sheet) are each referenced by **zero** of the 36 blocks. Sheet's absence was already known; Combobox's was masked, because the 19 blocks that appeared to depend on `COMP-016` meant Data Table. §9.2 still requires both for 30/30, and both remain last in the recommended order. Per D6 in `docs/plans/task-sequencing.md` §3, the pilot blocks decide: if one needs an overlay panel or a filtering input that no other approved component covers, they have their consumer; if not, record them here as catalog-complete-but-unused. Decide at the pilots, not when they reach the front of the queue.

### 9.3 Block queue — 36 minimum

**All rows additionally depend on §9.0**, and on `FOUND-005` specifically for manifest validation. `docs/plans/task-sequencing.md` §7 shows why blocks do not overlap component work as much as the queue order suggests: the manifest declares 317 component-dependency edges across 36 blocks (min 4, max 16, mean 8.8), so under the recommended component order the first block unlocks at component 6 and only 8 of 36 are available after 12.

First complete `BLOCK-000`. It assigns a concrete name, outcome, required states, component dependencies, and data boundary to every reserved slot. Each row then instantiates the Block DoD.

`BLOCK-000` is complete: `docs/contracts/block-catalog-manifest.json` is `status: approved`, declares `schemaVersion`, back-references §9.3, and defines all 36 blocks across 12 categories with a real name, outcome, state list, component dependencies, and data boundary. No placeholder names remain.

**The defect this queue was blocked on is fixed, and it was larger than recorded.** `BLOCK-000A` filed it as "eight component IDs outside `COMP-001..021`" and resolved it by moving them to a non-resolving `proposedComponents` field. That was the wrong diagnosis. Ten citations — not eight — used §9.1's `PRIM-*` numbers with a `COMP-` prefix, and every one matched `PRIM-<same number>` exactly. The names were never lost: `docs/contracts/block-catalog-manifest.md`, the companion beside the JSON, carried them all along.

Two of the ten fell **inside** `001..021`, which is why they were never flagged and why they were the dangerous ones — they resolved cleanly to the wrong component instead of failing:

- **`COMP-016` in 19 of 36 blocks meant Data Table**, while §9.2 defines `COMP-016` as Combobox. An ID-range check passes on all 19 while every one is built against the wrong component.
- **`COMP-014` collided**: `BLOCK-SETTINGS-02` meant Radio Group, matching §9.2; `BLOCK-SHELL-02` meant Command Palette.

All ten are corrected (manifest `schemaVersion: 2`), `proposedComponents` is empty for every block, and nine intended components were absent from the queue entirely, so §9.2 is extended to 30. The corrected graph is **367 edges across 36 blocks — min 5, max 17, mean 10.2**. §8.3.1 req 2 now resolves dependencies **by name**, and `FOUND-005` asserts that the `.json` and `.md` agree, because agreement between those two files is precisely what nothing checked.

Note also that `BLOCK-000` shipped while its own stated dependency — "representative `COMP-*` complete" — was 0/30, and with no validator. Approving a manifest ahead of the components is defensible for a naming exercise; approving it ahead of the validator is how ten wrong IDs and a silent 19-block misattribution survived review.

| Status | ID                | Category / slot                        | Size | Depends on                     |
| ------ | ----------------- | -------------------------------------- | ---- | ------------------------------ |
| [x]    | BLOCK-000         | Approve 36-item block catalog manifest | L    | representative COMP-* complete |
| [ ]    | BLOCK-AUTH-01     | Authentication 1                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-AUTH-02     | Authentication 2                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-AUTH-03     | Authentication 3                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ONBOARD-01  | Onboarding 1                           | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ONBOARD-02  | Onboarding 2                           | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ONBOARD-03  | Onboarding 3                           | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SETTINGS-01 | Settings 1                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SETTINGS-02 | Settings 2                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SETTINGS-03 | Settings 3                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-BILLING-01  | Billing 1                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-BILLING-02  | Billing 2                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-BILLING-03  | Billing 3                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ADMIN-01    | Administration 1                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ADMIN-02    | Administration 2                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-ADMIN-03    | Administration 3                       | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-OBS-01      | Observability 1                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-OBS-02      | Observability 2                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-OBS-03      | Observability 3                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-RESOURCE-01 | Resource management 1                  | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-RESOURCE-02 | Resource management 2                  | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-RESOURCE-03 | Resource management 3                  | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-AI-01       | AI interfaces 1                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-AI-02       | AI interfaces 2                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-AI-03       | AI interfaces 3                        | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SEARCH-01   | Search 1                               | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SEARCH-02   | Search 2                               | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SEARCH-03   | Search 3                               | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-COMMERCE-01 | Commerce 1                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-COMMERCE-02 | Commerce 2                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-COMMERCE-03 | Commerce 3                             | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-CONTENT-01  | Content 1                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-CONTENT-02  | Content 2                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-CONTENT-03  | Content 3                              | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SHELL-01    | Application shell 1                    | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SHELL-02    | Application shell 2                    | WP   | BLOCK-000, required COMP-*     |
| [ ]    | BLOCK-SHELL-03    | Application shell 3                    | WP   | BLOCK-000, required COMP-*     |

### 9.4 Template queue — 29 unique / 32 placements

**All rows additionally depend on §9.0.** Complete `TPL-000` first to assign stack, required blocks, deployment target, auth model, and portfolio tags. Shared templates are implemented once and appear in both portfolios. `TPL-000`'s own dependencies (`CLI-008`, `BLOCK-000`) are both complete, so it can start in parallel with §9.0; per `task-sequencing.md` §8.2 it should also produce the template→block fanout table, since no machine-readable template manifest exists and the Phase 4 order cannot be computed without one.

Two templates already exist under `templates/` — `vite-solid-router` and `tanstack-start-solid` — but they are `CLI-007` deliverables that prove the `solidiom create` materializer, not `TPL-*` catalog entries. They are why the `TPL-000` row's portfolio/size columns matter: the counter in §11 reads 0 unique templates because no `TPL-*` row has started, and that is correct even though the repository can scaffold a working project today.

| Status | ID      | Template                                         | Portfolio             | Size | Depends on                |
| ------ | ------- | ------------------------------------------------ | --------------------- | ---- | ------------------------- |
| [ ]    | TPL-000 | Approve template architecture/portfolio manifest | Both                  | L    | CLI-008, BLOCK-000        |
| [ ]    | TPL-001 | Authentication Starter                           | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-002 | Onboarding App                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-003 | SaaS Dashboard                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-004 | Multi-tenant Admin                               | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-005 | Settings Portal                                  | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-006 | Billing Portal                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-007 | Resource Manager                                 | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-008 | Observability Console                            | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-009 | AI Chat                                          | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-010 | AI Workflow                                      | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-011 | Search Application                               | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-012 | Storefront                                       | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-013 | Marketplace                                      | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-014 | Content Studio                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-015 | Marketing Site                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-016 | Documentation/Product Site                       | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-017 | Identity & Access                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-018 | Audit Log                                        | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-019 | Billing Operations                               | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-020 | Incident Response                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-021 | AI Operations                                    | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-022 | API Management                                   | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-023 | Developer Portal                                 | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-024 | Security Center                                  | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-025 | Compliance Center                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-026 | Data Governance                                  | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-027 | Workflow Automation                              | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-028 | Support Operations                               | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-029 | Enterprise Settings                              | Enterprise            | WP   | TPL-000, required BLOCK-* |

### 9.5 Theme preset queue and builder completion

| Status | ID          | Theme/tool                                                                               | Size | Depends on                 |
| ------ | ----------- | ---------------------------------------------------------------------------------------- | ---- | -------------------------- |
| [x]    | PRESET-001  | Ocean preset, docs, previews, outputs                                                    | M    | THEME-005, THEME-006       |
| [x]    | PRESET-002  | Forest preset, docs, previews, outputs                                                   | M    | THEME-005                  |
| [x]    | PRESET-003  | Slate preset, docs, previews, outputs                                                    | M    | THEME-005                  |
| [x]    | PRESET-004  | Aurora preset, docs, previews, outputs                                                   | M    | THEME-005                  |
| [x]    | PRESET-005  | Cross-preset contrast/coverage/translation gate                                          | M    | PRESET-001..004            |
| [ ]    | BUILDER-007 | Complete representative preview coverage for all 30 components                           | L    | BUILDER-003, COMP-001..030 |
| [x]    | BUILDER-008 | Publish bilingual builder docs, privacy model, limitations, and migration/version policy | M    | BUILDER-004..007           |
| [ ]    | PRESET-006  | Bilingual docs and previews for the four presets, and a `/themes/[name]/` catalog route  | M    | FOUND-006, FOUND-007       |

### G4 exit checklist

- [x] `FOUND-001..009` complete (§9.0) — all 9/9. Phase 0 foundations are done; §§9.2–9.5 are unblocked. Sequencing and the D1–D6 resolutions live in `docs/plans/task-sequencing.md`.
- [x] `PRIM-001..052` complete: exactly 52/52. Enforced by `PRIM-000` (`tools/primitive-catalog-gate.ts`).
- [ ] `COMP-001..030` complete: exactly 30/30. Enforced by `FOUND-004`.
- [ ] At least 36 named `BLOCK-*` items complete, three or more per category. Manifest approved (`BLOCK-000`) and its misnumbered `COMP-*` citations corrected (`BLOCK-000B`); 0 implemented.
- [ ] `TPL-001..029` complete and exposed as 32 portfolio placements.
- [ ] All template × package-manager smoke combinations pass.
- [ ] Four presets and full builder satisfy English/Spanish, theme, accessibility, browser, and output gates. Preset outputs and `audit:preset-themes` pass, but the bilingual docs and previews §9.5 claims do not exist — no `themes` content entries, no `/themes/[name]/` route (`PRESET-006`). `BUILDER-007` is blocked on `COMP-001..030`.
- [ ] No placeholder block name, stale translation, unsigned manifest, or maturity exception remains. Translations are current (0 stale, 0 missing) but **0 of 171 records are human-reviewed** (`I18N-005`, G5 bar), and the registry index is unsigned pending `REG-008`.
- [ ] An executable check re-verifies per-primitive and per-component DoD completion, so this checklist cannot be satisfied by prose alone (`PRIM-000` for primitives; `FOUND-004`/`FOUND-005` for components and blocks; templates have no gate until `TPL-000` writes one).

---

## 10. M5 — GA hardening and cutover

### 10.1 Curated playground

| Status | ID       | Size | Depends on            | Owner area     | Task and acceptance boundary                                                                                                |
| ------ | -------- | ---- | --------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | PLAY-001 | M    | SITE-012              | Security/tools | Write threat model and define iframe sandbox, CSP, message protocol, allowed APIs, resource limits, and prohibited imports. |
| [ ]    | PLAY-002 | L    | PLAY-001              | Tools          | Build Worker-based TSX/CSS compilation proof using pinned local dependencies; no arbitrary remote import support.           |
| [ ]    | PLAY-003 | L    | PLAY-001, PLAY-002    | Tools          | Implement sandboxed iframe runtime, deterministic reset, console/error serialization, timeout/recovery, and teardown.       |
| [ ]    | PLAY-004 | M    | PLAY-002, SITE-004    | Tools/frontend | Build accessible editor tabs, preview, output, reset, copy, and open controls as a route-local Solid application.           |
| [ ]    | PLAY-005 | M    | CONTENT-005, PLAY-004 | Content/tools  | Define curated example manifest and canonical source loading; initial examples cover state, form, overlay, and composition. |
| [ ]    | PLAY-006 | S    | PLAY-003, GOV-004     | Privacy        | Emit only categorical allowlisted events; ensure source/error payloads cannot reach PostHog.                                |
| [ ]    | PLAY-007 | M    | PLAY-001..006         | QA             | Add browser, keyboard, screen-reader, reduced-motion, mobile, CSP, isolation, leak, and bundle-boundary tests.              |
| [ ]    | PLAY-008 | S    | PLAY-004              | Frontend       | Provide static unsupported-browser fallback and preserve access to source examples without execution.                       |

### 10.2 Marketing, editorial, analytics, and newsletter

| Status | ID            | Size | Depends on        | Owner area            | Task and acceptance boundary                                                                                                                                                                                                                                                                                                                             |
| ------ | ------------- | ---- | ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | MKT-001       | L    | G1, BRAND-004     | Marketing/frontend    | Implement responsive homepage faithful to the board: hero, proof, starting layers, compatibility, ownership, catalog/theme/tool previews, CTA, and footer.                                                                                                                                                                                               |
| [ ]    | MKT-002       | M    | REG-003, SITE-004 | Marketing/frontend    | Implement Primitives, Components, Blocks, Templates, and Themes landing/directory shells with accurate status/counts.                                                                                                                                                                                                                                    |
| [ ]    | MKT-003       | M    | CONTENT-002       | Content               | Implement Getting Started, Architecture, Styling, Composition, SSR, Testing, and Migration guide skeletons.                                                                                                                                                                                                                                              |
| [ ]    | MKT-004       | M    | A11Y-003          | Content/accessibility | Implement accessibility landing page using real evidence and documented consumer responsibilities.                                                                                                                                                                                                                                                       |
| [x]    | MKT-005       | S    | REG-003           | Content               | Implement registry/CLI explanation and signed-source ownership flow. Bilingual guides at `apps/site/src/content/{en,es}/guides/registry-ownership.md` — the Spanish file keeps the English slug (title "Registro y Propiedad del Código Fuente Firmado") so route parity holds; both are `draft` and current under `translation:check` since `I18N-005`. |
| [ ]    | MKT-006       | M    | GOV-002, REG-003  | Content               | Implement technical Enterprise page: architecture, security, versioning, governance, migration, and accessibility; no sales/SLA claims.                                                                                                                                                                                                                  |
| [ ]    | MKT-007       | S    | GOV-003           | Community             | Implement GitHub-only Community and Contributing pages; remove Discord/inactive social placeholders.                                                                                                                                                                                                                                                     |
| [ ]    | MKT-008       | M    | CONTENT-002       | Editorial             | Publish foundational article: Solid 2 architecture.                                                                                                                                                                                                                                                                                                      |
| [ ]    | MKT-009       | M    | CONTENT-002       | Editorial             | Publish foundational article: accessible interaction contracts.                                                                                                                                                                                                                                                                                          |
| [ ]    | MKT-010       | M    | CONTENT-002       | Editorial             | Publish foundational article: source ownership.                                                                                                                                                                                                                                                                                                          |
| [ ]    | MKT-011       | M    | CONTENT-002       | Editorial             | Publish foundational article: styling-system neutrality.                                                                                                                                                                                                                                                                                                 |
| [ ]    | MKT-012       | M    | CONTENT-002       | Editorial             | Publish foundational article: building with Solidiom.                                                                                                                                                                                                                                                                                                    |
| [ ]    | MKT-013       | S    | CONTENT-002       | Editorial             | Implement changelog and migration content types, feeds, archive pages, and structured metadata.                                                                                                                                                                                                                                                          |
| [ ]    | ANALYTICS-001 | M    | GOV-004, SITE-004 | Privacy/platform      | Implement typed PostHog adapter with autocapture/session replay disabled and environment-safe no-op behavior.                                                                                                                                                                                                                                            |
| [ ]    | ANALYTICS-002 | S    | ANALYTICS-001     | QA/privacy            | Add payload tests proving prohibited fields cannot be emitted.                                                                                                                                                                                                                                                                                           |
| [ ]    | ANALYTICS-003 | S    | ANALYTICS-001     | Operations            | Configure production key/domain through Cloudflare environment settings; no key in source.                                                                                                                                                                                                                                                               |
| [ ]    | NEWS-001      | M    | GOV-005, SITE-006 | Frontend/privacy      | Implement Buttondown form, explicit consent, validation, loading/success/error/confirmation behavior, and no analytics leakage.                                                                                                                                                                                                                          |
| [ ]    | NEWS-002      | S    | NEWS-001          | QA                    | Add keyboard, error, localization, privacy, and external-endpoint integration tests/mocks.                                                                                                                                                                                                                                                               |

### 10.3 Quality, security, and hardening

| Status | ID      | Size | Depends on           | Owner area    | Task and acceptance boundary                                                                                                         |
| ------ | ------- | ---- | -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [ ]    | QA-001  | L    | G4                   | Accessibility | Complete WCAG 2.2 AA/APG audit across marketing, docs, catalogs, tools, and generated applications; resolve critical/serious issues. |
| [ ]    | QA-002  | L    | G4                   | QA            | Complete current/previous Chrome, Edge, Firefox, Safari, and current iOS Safari matrix; document static fallbacks.                   |
| [ ]    | QA-003  | L    | G4                   | Visual QA     | Approve desktop/tablet/mobile × light/dark × English/Spanish visual matrix and intentional diffs.                                    |
| [ ]    | QA-004  | M    | G4                   | Performance   | Enforce final content/catalog/tool Core Web Vitals and bundle budgets; verify no editor/compiler leakage.                            |
| [ ]    | QA-005  | M    | G4                   | Content       | Run full bilingual freshness, terminology, link, canonical, `hreflang`, metadata, sitemap, feed, and structured-data audit.          |
| [ ]    | QA-006  | M    | G4                   | Search        | Verify Pagefind coverage, result types/locales, keyboard behavior, ranking smoke cases, and no query analytics.                      |
| [ ]    | QA-007  | M    | G4                   | Security      | Run registry tamper, signature/hash, CSP, sandbox, dependency, and generated-project security checks.                                |
| [ ]    | QA-008  | M    | G4                   | CLI           | Run init/add/create/plan/verify/diff/update matrix, offline fixtures, conflict/rollback paths, and npm/pnpm/Yarn/Bun tests.          |
| [ ]    | QA-009  | S    | G4                   | Privacy       | Verify PostHog allowlist, Buttondown consent, provider configuration, and absence of prohibited payloads.                            |
| [ ]    | QA-010  | S    | GOV-001..006         | Governance    | Complete legal/policy review and publish license, privacy, security, DCO, contribution, and brand-use documents.                     |
| [ ]    | OPS-004 | M    | OPS-003, QA-004..010 | Operations    | Configure production Cloudflare project, DNS, redirects, headers/CSP, caching, monitoring, rollback, and access controls.            |
| [ ]    | OPS-005 | S    | OPS-004              | Operations    | Conduct production deployment rehearsal and rollback exercise using a release candidate.                                             |
| [ ]    | CUT-001 | M    | MIG-001, G4          | Migration     | Verify every legacy route/demo/report inventory item has a validated destination, redirect, archive, or deletion decision.           |
| [ ]    | CUT-002 | S    | CUT-001, BASE-001    | Repository    | Archive POC findings under `docs/`, confirm equivalent checks in `apps/site`, then remove `apps/docs-astro-poc`.                     |
| [ ]    | CUT-003 | M    | CUT-001              | Repository    | Remove `apps/docs`, update workspace/CI/e2e references, and preserve required redirects/artifacts.                                   |
| [ ]    | CUT-004 | S    | CUT-002, CUT-003     | Repository    | Remove temporary parity tooling, obsolete dependencies, stale generated assets, and migration-only configuration.                    |
| [ ]    | CUT-005 | S    | OPS-005, CUT-004     | Release       | Publish GA release notes, changelog, migration guidance, known limitations, security contact, and rollback reference.                |
| [ ]    | CUT-006 | S    | CUT-005              | Operations    | Deploy `solidiom.org`, verify production acceptance checks, and announce through GitHub-only community channels and Buttondown.      |

### G5 exit checklist

- [ ] Every acceptance criterion in `docs/plans/website-plan.md` §14 passes.
- [ ] Playground, marketing pages, analytics, and newsletter are live and tested.
- [ ] No temporary dogfooding, maturity, translation, security, accessibility, or performance exception remains.
- [ ] All 52 primitives have registry `status: "stable"` — per §8.1.2, each was promoted individually after human-reviewed Spanish and recorded manual evidence.
- [ ] `a11y:coverage-gate` and `validate-translation-freshness.ts` GA blocking pass with zero violations across the 52.
- [ ] Production deployment and rollback are rehearsed.
- [ ] Legacy docs and POC are removed only after parity verification.
- [ ] `solidiom.org` is canonical and all redirects/locale alternates resolve correctly.

---

## 11. Progress rollup

Update this table when tasks move; do not infer completion from generated files alone.

**A task row may only be marked `[x]` when something re-checks it.** This rollup and its task rows contradicted each other for several commits — the rows read `[x]` while this table still described work that had shipped, and separately `BETA-002` read `[x]` while its own acceptance matrix was failing. Both were possible because the deciding evidence ran nowhere: `beta:acceptance:report` and `beta:acceptance:e2e` existed only as `package.json` scripts, and `gate:phase3` was never a CI job. Prose that nothing verifies decays silently, so when closing a task, name the blocking CI step that will fail if it regresses — and if there is none, either add one or record the gap as an accepted limitation with an owner.

Advisory (`continue-on-error`) jobs deserve particular suspicion: `site-visual` mismatched all 36 baselines for several commits without anyone noticing, because an advisory failure looks much like an advisory pass in the run summary.

**The rule then failed in a third, worse way.** Naming a CI job is not the same as having one. `.github/workflows/ci.yml` was unparseable from the commit that added `phase3-gate` onward, so for the entire span in which G3 was declared complete, _no_ job in it ran — not the jobs added to close the earlier drift, not `format`, not `typecheck`, not `build`. The mis-indentation sat inside `phase3-gate` itself, the very job added to stop that gate from going unrun. The previous fix wired evidence into a file and then stopped checking that the file loads. A check is not landed until it has been observed to execute: prefer verifying the run over verifying the configuration, and re-read `git status` after a verification pass rather than trusting that a passing command changed nothing.

**And the observed run must be at `HEAD`.** Run `30871761546` is green, but it is five commits back; the three runs after it were cancelled by the next push, and the `HEAD` run lost `phase2-gate` to a startup failure. A green run on an ancestor says nothing about the enforcement a later commit added — check `gh run list` against `git rev-parse HEAD`, and check the attempt number, since a re-run's job list is easy to confuse with the original's. Since 2026-08-04 the workflows are dispatch-only (`CI-008`), so nothing produces a run at all unless someone asks for one.

| Milestone                 | Status      | Gate | Completion evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------- | ----------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M0 Governance/inputs      | Complete    | G0   | GOV-001..006, BRAND-001..004, BASE-001..002, OPS-001..002, MIG-001..002 complete. GOV-005/GOV-006 ship as published bilingual site content (`apps/site/src/content/{en,es}/pages/privacy.md`, `trademark.md`); BRAND-004 source assets under `apps/site/src/assets/brand/`. No unmet G0 exit items remain (`.env` confirmed untracked/never committed to git history).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| M1 Foundation/alpha shell | Complete    | G1   | SITE-001 through SITE-014, I18N-001..004, TEST-001..004, CI-001..004, and OPS-003 complete. `pnpm --filter @solidiom/site check`, the production build (428 pages), and the E2E suite all pass: **435/435 across Chromium, Firefox, WebKit, mobile-chrome, and mobile-safari** in a single local run, no retries. Protected Cloudflare previews are validated after deployment by `preview-deploy.yml`, which does parse. Visual baselines pass 36/36 in the pinned container (`pnpm run visual:container`) and in CI; a bare `test:visual` still fails off-Linux, which is the platform difference `TEST-005` diagnosed rather than a content regression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| M2 Content vertical slice | Complete    | G2   | REG-001..007, CONTENT-001..005, API-001..005, A11Y-001..006, DOCS-001..006, SEARCH-001..005, and VS-001..004 complete. `gate:vertical-slice` reports 67/67 with §9.1's rows at `[x]`. It reported 66/67 for a while because its §11 bypass assertion grepped this document's raw text for complete-status primitive rows — equivalent to "no bypass" only while `VS-004` was open. `VS-005` replaced that with a delegation to `PRIM-000`, so the assertion now reads the registry and content collections. Sections 1–10 carry signal and pass: registry determinism, per-primitive docs for the three slice primitives, route generation, Pagefind wiring, search-analytics privacy, locale parity, performance budgets, manual evidence, and `astro check`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| M3 Public beta platform   | Complete    | G3   | `RECIPE-001`..`006`, `THEME-001`..`006`, `CLI-001`..`010`, `BUILDER-001`..`006`, `BETA-001`..`003`, `A11Y-007`, and `A11Y-008` are complete, and every command named as their evidence was re-run locally for this update: `gate:phase1` 252/252 (it silently regressed to 243/245 under `RECIPE-007` and was restored — see `RECIPE-008`; the count rose from 245 as TEST-005 added §12 image-pinning checks and A11Y-010 added §13), `gate:phase3` 21/21 (which itself re-runs the phase 0/1/2 gates), `recipe:contract` 15 scopes valid, `recipe:emit:{css,tailwind,unocss}:check`, `audit:recipe-parity`, `test:recipe-parity`, `theme:emit:*:check`, `audit:theme-parity` (including site-token contrast), `audit:preset-themes`, `audit:package-source-parity`, `assert:no-unverified`, and `api:coverage-gate` all exit 0. `beta:acceptance:report` 60/60. `beta:acceptance:e2e` **111/111 across Chromium, Firefox, and WebKit** — the previously recorded 74/74 omitted the WebKit project. **Now enforced:** run `30871761546` was green across all 31 jobs — the first observed full run, and the first execution of `phase0`–`phase3-gate`, `vertical-slice-gate`, `test-node`, `test-browser`, `test-solid-matrix`, `a11y-axe-scan`, and `cli-smoke-create`. G3 no longer rests on a local verification pass (`CI-005` closed) — though that run is at `079512e`; the `HEAD` run (`30878697281`) is green on 29 of 31 jobs with `phase2-gate` lost to a 2-second runner startup failure and `phase0`/`phase3-gate` skipped behind it. Workflows are now dispatch-only (`CI-001`, `CI-008`). Open limitations: `QA-004`, `I18N-005`'s G5 half, `RECIPE-008`, `REG-008`, `CI-008` — see §7.3 and §11.1. |
| M4 Catalog completion     | In progress | G4   | **52/52 primitives pass the M4 bar** (§8.1.1), enforced by `PRIM-000` (`tools/primitive-catalog-gate.ts`), which reports 52/52 and asserts the count against the `DoD` column below. Each has an EN/ES overview with the required sections, one EN/ES example, an EN/ES accessibility contract, a source-linked API artifact, four routes per locale, and a committed `evidence.json` with `passes > 0`. The two blockers recorded here earlier are closed: the registry now matches source truth (`generatedAt: 2026-08-03T17:02:33Z`, all 52 `evidence.json` files committed — `A11Y-009`, with `BUILD-001` guarding recurrence), and Spanish carries real source hashes with 0 stale records (`I18N-005`). What remains is the §8.1.2 G5 bar: 0 of 171 translation records are `human-reviewed` and all 52 primitives stay `status: "preview"`. `BLOCK-000` approved 36 named blocks across 12 categories, and the `COMP-*` defect `BLOCK-000A` had filed as "8 out-of-range IDs" turned out to be ten `PRIM-*`-numbered citations, two of them inside `001..021` and therefore resolving silently to the wrong component — 19 blocks meant Data Table and cited Combobox's ID. All ten are corrected at manifest `schemaVersion: 2`, and §9.2 is extended to **30** components because nine of the intended ones were never approved (Spinner alone is required by all 36 blocks). `PRESET-001`..`005` complete and audited — outputs only; the docs and previews §9.5 claims are `PRESET-006`. 0/30 components, 0/36 blocks, 0/29 templates. **§9.0 machinery is complete: 9/9 FOUND-001..009**, and the gates are wired into CI (`catalog-gates` job) and `phase1-gate.ts` §15.                              |
| M5 GA/cutover             | In progress | G5   | Began incidentally, ahead of G4: `MKT-005` and `BUILDER-008` shipped as bilingual site guides. Everything else is untouched — playground (`PLAY-001`..`008`), homepage and landing shells (`MKT-001`..`004`, `006`..`013`), analytics, newsletter, hardening (`QA-001`..`010`), production operations (`OPS-004`..`005`), and cutover (`CUT-001`..`006`). `apps/docs` and `apps/docs-astro-poc` both still exist, consistent with `CUT-002`/`CUT-003` being open. `tools/phase4-gate.ts` exists but is wired to nothing (§3.1). 0/5 foundational articles: `apps/site/src/content/en/blog/`, `es/blog/`, and `en/changelog/` are empty.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### 11.1 Open defects and evidence gaps

Discovered by re-running this document's own evidence commands against the current tree. Ordered by how much other evidence each one invalidates.

| Status | ID         | Size | Owner area       | Defect and acceptance boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | ---------- | ---- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]    | CI-005     | XS   | CI               | Repair `.github/workflows/ci.yml`. `phase3-gate`'s final step was mis-indented — `- name:` at column 1 with an over-indented `run:` beneath it — so the file was invalid YAML and GitHub loaded no jobs from it at all. **Resolved:** the file parses, prettier accepts it, all 22 jobs load with no dangling `needs:`, `phase3-gate` carries its eighth step (`pnpm run gate:phase3`), and run `30871761546` was green across all 31 matrix-expanded jobs — the first observed full run. The two failures predicted here were fixed before that run rather than observed failing in it: `CI-006`'s 132 files and `TEST-005`'s baselines.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [x]    | CI-006     | XS   | CI               | Restore formatting. `prettier --check .` reported 132 unformatted files: 52 in `docs/at-audit-results/`, 66 across the eleven new primitive doc sets, 6 bilingual guides under `apps/site/src/content/`, 4 in `tools/`, and `scripts/generate-at-records.js`. **Resolved:** the generator was fixed rather than only its output, `pnpm format` ran, and `format:check` now reports all matched files clean. `docs/axe-scan-results.md` was subsequently added to `.prettierignore` because its generator and Prettier pad markdown tables differently and rewrote each other indefinitely.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [x]    | VS-005     | XS   | QA/platform      | Correct `tools/vertical-slice-gate.ts` §11. Its bypass assertion was a regular expression over this document's raw text that counted complete-status primitive rows; that was equivalent to "no bypass" only while `VS-004` was open, and it matched prose as well as table rows, so a sentence describing the check could fail the check. **Resolved:** §11 now delegates to `PRIM-000`, which derives its count from the registry and content collections and asserts it against the tracker declaration. `gate:vertical-slice` reports 67/67 with every `PRIM-*` row closed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [x]    | I18N-005   | L    | Content platform | Bring shipped Spanish content to §8.5. **Partly resolved.** `translation:check` reported 0 human-reviewed, 8 draft, 49 stale; it now reports **0 human-reviewed, 171 draft, 0 stale, 0 missing, 0 GA blockers** — the 64-zero placeholder hashes were replaced with real values and the 7 CLI guides that had dropped protected literals or glossary terms were repaired (`4aa1058`). Still open, and deliberately deferred to G5 per §8.1.2: human review itself, and the decision on whether freshness stays report-only below GA. As written, §8.5 can never fail a build before GA, so this row cannot be closed by a check — it closes per primitive as each is promoted to `stable`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [x]    | A11Y-009   | M    | Accessibility    | Commit the generated accessibility evidence and rebuild the registry. `tools/a11y-evidence.ts` writes `packages/<name>/docs/accessibility/evidence.json` for every primitive with a `docs/accessibility/` directory, but only Dialog, Combobox, and Data Table's copies were tracked, so `registry:build` read no evidence for the rest and the committed registry was a month stale. CI could not self-heal it: the `build` job runs `registry:build`, while `a11y-axe-scan`, which produces the evidence, `needs: build` on a separate runner. **Resolved:** all **52** `evidence.json` files are tracked, the registry is rebuilt (`generatedAt: 2026-08-03T17:02:33Z`), and Visually Hidden's vacuous `passes: 0` result is fixed — `docs/axe-scan-results.md` now records 441 passing checks against the earlier 433, with command-palette, date-picker, and visually-hidden corrected from 0. Recurrence is guarded by `BUILD-001` and by `PRIM-000`, which fails any primitive whose `evidence.json` reports `passes <= 0`. Note `a11y:coverage-gate` was **not** widened: it still fires only on `status: "stable"`, of which there are zero, so it contributes nothing here.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| [x]    | BUILD-001  | S    | Build            | Make the generated-artifact audits inspect the committed tree, not the freshly built one. At the time, `packages/unocss-preset/source/generated-theme-preflights.ts` was missing the four presets and the type-scale tokens its `src/` counterpart contained, so `src`/`source` parity was broken as committed while `audit:package-source-parity` passed — the `build` job regenerated `source/` first. **Resolved:** the `build` job now runs a `BUILD-001` step that fails when a build or generator dirties `registry/`, `packages/*/source/`, or `packages/*/docs/accessibility/evidence.json`, and it distinguishes timestamp-only churn from substantive staleness. Two follow-on fixes were needed to make it satisfiable: generation stamps are preserved when content is unchanged, and evidence provenance (`lastRun`, `provenance.commitSha`) no longer advances on identical scan results (`3705238`). Registry index signing was removed from the job for the same reason and re-tracked as `REG-008`. Verified: `gate:phase1`, `gate:vertical-slice`, and `audit:adapter-styling` all leave the tree clean.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [x]    | PRIM-000   | M    | QA/platform      | Add an executable per-item catalog DoD gate so §9 counts cannot rest on prose. **Resolved:** `tools/primitive-catalog-gate.ts` derives §8.1.1 status per primitive from the registry and content collections — docs presence and required sections, locale status and source hash, a11y review status and evidence IDs, committed `evidence.json` with `passes > 0`, API artifact, route set, `status: "preview"` — and asserts the resulting count against the `DoD` column in §11's scope counters. `pnpm run primitive:catalog-gate` reports 52/52, and `gate:vertical-slice` §11 delegates to it. An equivalent gate for `COMP-*` does not exist yet and will be needed before the first component row closes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [x]    | TEST-005   | M    | Visual QA        | **Resolved.** The 36/36 local failure was a platform difference, not stale content. The containerised harness ships as `tools/visual-container.sh` (`visual:container` / `visual:update:container`) plus a dispatchable `visual-baselines.yml`; baselines were recaptured in `mcr.microsoft.com/playwright:v1.61.1-noble`, `site-visual` runs in that image, passed in run `30871761546`, and is now blocking. `gate:phase1` §12 pins the image tag to the installed `@playwright/test`. Full reasoning in §7.3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [x]    | CI-007     | XS   | CI               | Promote `beta-acceptance-e2e` from `continue-on-error: true` to blocking now that it passes 111/111, and correct its inline comment, which described the pre-`A11Y-008` `color-contrast` failures as current. **Resolved:** the job is blocking and green in run `30871761546`; `site-lighthouse` is the only `continue-on-error` job left in `ci.yml`, deliberately, under `QA-004`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| [x]    | RECIPE-007 | M    | Design systems   | Bring typeset/prose into the canonical contract and the UnoCSS profile. They shipped as `packages/recipes-css/src/styles/{typeset,prose}.css` and `packages/recipes-tailwind/src/recipes/typeset.tsx` with no UnoCSS counterpart, and because the scopes were absent from `tools/recipe-contract-definitions.ts`, `audit:recipe-parity` reported parity regardless. **Resolved:** both are declared scopes (typeset 5 slots, prose 1), `recipe:contract` validates 15 scopes, all three emitters generate them, and `packages/recipes-unocss/src/styles/` carries `prose.css` and `typeset.css`. Two residual gaps and the two tests this broke are tracked in `RECIPE-008`. See §7.1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [x]    | BLOCK-000A | S    | Product/design   | Reconcile `docs/contracts/block-catalog-manifest.json` with §9.2. **Closed, then reopened and closed correctly as `BLOCK-000B`** — the original diagnosis was wrong. It recorded eight IDs outside `COMP-001..021` and moved them to a non-resolving `proposedComponents` field, which treated recoverable data as unrecoverable: the names sat in `block-catalog-manifest.md` the whole time, and reading them shows all eight were `PRIM-*` numbers carrying a `COMP-` prefix. It also missed the two misnumbered citations that landed **inside** the approved range and so resolved silently to the wrong component. See `BLOCK-000B`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [x]    | BLOCK-000B | S    | Product/design   | Correct all ten `PRIM-*`-numbered citations in the block manifest and extend §9.2 to cover what they meant. Ten citations, 70 occurrences: Spinner ×36, Data Table ×19, Progress ×7, Meter ×2, and Kbd, Resizable Panels, Scroll Area, Toolbar, Command Palette ×1 each, plus `COMP-043` Switch folding into `COMP-015` as a duplicate identity. **The two dangerous ones were in range:** `COMP-016` meant Data Table in 19 blocks while §9.2 defines it as Combobox, and `COMP-014` meant Command Palette in `BLOCK-SHELL-02` while meaning Radio Group in `BLOCK-SETTINGS-02`. Nine intended components had no approved row, so §9.2 goes 21 → 30. Manifest at `schemaVersion: 2`, `proposedComponents` empty for all 36, `.md` and `.json` agree 36/36, corrected graph 367 edges / mean 10.2. Side effect: `COMP-016` Combobox now has **zero** block consumers, joining `COMP-018` Sheet. Enforcement is `FOUND-005`, which must resolve by name — an ID-range check passes on every one of these defects.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [ ]    | CI-008     | XS   | CI               | Re-decide the workflow trigger policy. All five workflows were switched to `workflow_dispatch`-only on 2026-08-04 (`CI-001`), so no push or pull request re-checks anything: the enforcement layer this document leans on now fires only when dispatched by hand. Either restore the commented `push`/`pull_request` triggers in `ci.yml` and `preview-deploy.yml`, or record dispatch-only as the accepted policy and state who dispatches, on what cadence, and what happens to a regression pushed between dispatches. `OPS-003`'s per-PR Cloudflare preview is disabled by the same change and needs the same decision.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [ ]    | RECIPE-008 | XS   | Design systems   | **Pre-GA.** Close the two residual gaps from `docs/plans/typeset-plan.md`; four of its six acceptance criteria are met and the other two are `RECIPE-007` fallout. (a) `recipes-css` and `recipes-tailwind` `src/styles/index.css` each `@import` `typeset.css` and `prose.css` **twice**. `RECIPE-007` promoted both into `REFERENCE_DEFINITIONS`, so they are now emitted as ordinary scopes, but `UTILITY_STYLESHEETS` in `recipe-emit-css.ts` and `NON_GENERATED_STYLESHEETS` in `recipe-emit-tailwind.ts` still append them, and both emitters still comment that they are "hand-authored and may or may not exist". `recipe-emit-unocss.ts` composes from scopes alone and is correct — make the other two match it and drop the stale lists. `recipe:emit:*:check` cannot catch this: the duplication is generated deterministically, so committed and generated agree. (b) The typeset and prose demos exist only at `apps/docs/src/demos/recipes/{typeset,prose}-recipe-demo.tsx`, and `apps/docs` is deleted by `CUT-003`; `apps/site` contains no typeset or prose usage at all. Port both demos to `apps/site` before `CUT-003` runs, or typeset ships to GA with no rendered example. Sequence (b) ahead of `CUT-003`. **Also restore what RECIPE-007 broke in the gates.** `gate:phase1` reported 243/245, not the 245/245 then recorded in §11: `recipe-contract-definitions.test.ts` asserts `REFERENCE_DEFINITIONS` maps one-to-one onto shipped `recipes/*.tsx` wrappers, which `typeset` and `prose` break by design since they ship as stylesheets only; and `recipe-contract-tokens.test.ts` read the CSS property in the emitted `@apply [border-left-width:2px]` as a Tailwind colour utility, yielding a phantom `left-width` theme name. Both are fixed and the gate is green again — 245/245 at the time, 252/252 today after the §12 and §13 additions — but the underlying lesson belongs here: RECIPE-007 was closed while breaking two tests in a declared CI job, and nothing surfaced it because `ci.yml` did not run (`CI-005`) and the gate was not re-run locally afterwards. |
| [x]    | A11Y-010   | S    | Accessibility    | **Resolved.** The committed report was dated `2026-07-22`, claimed **5** adapter packages scanned, and asserted "✓ No adapter sets class or style attributes", while the generator found **7** — `adapter-kit` was added since — and **1 violation**. All three underlying problems are fixed. (1) The violation was a false positive: `packages/adapter-kit/src/conformance.test.ts:227` embeds `return { className: "btn-primary" }` inside a template literal as a deliberate negative fixture, so the scanner was measuring a test's inputs rather than an adapter's output. Test and spec files are now excluded, and the audit reports 0 violations across all 7 adapters. (2) Regenerating previously destroyed hand-added YAML frontmatter the generator did not emit; it now emits it, matching `generate-axe-report.ts`, which already did. Frontmatter was kept rather than dropped because 12 of 13 files in `docs/evidence/` carry it — nothing consumes it programmatically, but it is the near-universal convention. (3) Nothing ran the tool. It now has an `audit:adapter-styling` script and a `gate:phase1` §13 section asserting both that no adapter emits styling and that the committed report matches generated output, so this cannot drift silently again. Report output is deterministic — three consecutive runs produce identical checksums — and Prettier-clean as generated, so it needs no `.prettierignore` entry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [ ]    | REG-008    | M    | Security/CLI     | **Pre-GA.** Re-home registry index signing, and move it off HMAC. Signing was removed from the `build` job because it rewrote the committed `registry/index.json` with `signature`/`signedAt`/`signatureKeyId`, which `BUILD-001` then reported as stale — 4 substantive lines in run `30856899323`. That conflict is structural, not tunable: the committed index is a deterministic build output, while a secret-derived signature belongs to the published copy, and committing the signed form only moves the failure to every build without the secret. Two pieces of work. (1) **Re-home:** sign in the release workflow over the published artifact, never writing back into the tree. This is gated on the registry actually being published — there is no `packages/registry` today and nothing publishes `registry/`, which is why the signing step's output was discarded at job end and why its absence changes no consumer. (2) **Re-key:** the index uses `createHmac("sha256", key)` in `registry-build.ts` and is verified the same way at `packages/cli/src/commands/verify.ts:291`–`305`. HMAC is symmetric, so `policy.registryTrustedKeys` and `REGISTRY_VERIFY_KEY` are _forging_ keys — any party able to verify can also mint a valid index. That is not publisher authenticity. The artifact path already does this correctly with `createVerify` plus `@sigstore/verify`/`@sigstore/tuf`; bring the index onto the same asymmetric primitive. Note the CLI reads the signature **inline** from `integrity`, so a detached `.sig` would additionally require a CLI change. Until (1) lands, `registrySignatureRequired` cannot be turned on for the index without failing closed on an unsigned artifact.                                                                                                                                                                                                                                                                                                                                                                                |

### Scope counters

Two columns, because collapsing them is how the previous "11/52 primitives" reading arose. `DoD` counts items meeting the §8 Definition of Done for their layer. `Landed` counts items whose deliverables exist and are reachable on the site but which still have an open DoD requirement.

| Scope                         | Required | DoD | Landed |
| ----------------------------- | -------: | --: | -----: |
| Primitives                    |       52 |  52 |     52 |
| Components                    |       30 |   0 |      0 |
| Blocks                        |     ≥ 36 |   0 |      0 |
| Unique templates              |       29 |   0 |      0 |
| Template portfolio placements |       32 |   0 |      0 |
| Theme presets                 |        4 |   4 |      4 |
| Foundational articles         |        5 |   0 |      0 |
| Locales                       |        2 |   2 |      2 |

`Primitives / DoD = 52`: all 52 primitives pass the M4 bar (§8.1.1) as enforced by `tools/primitive-catalog-gate.ts`. Each has EN/ES overview with required sections, a11y contract, committed evidence, and current registry metadata. The G5 bar (§8.1.2) — human-reviewed Spanish and `stable` status — remains open per `I18N-005`.

`Theme presets` is the only catalog row at parity: Ocean, Forest, Slate, and Aurora exist in `packages/themes/src/{css,tailwind}/` with UnoCSS output in `packages/unocss-preset/src/generated-theme-preflights.ts`, and `audit:preset-themes` passes.

`Foundational articles = 0` is literal: `apps/site/src/content/en/blog/`, `es/blog/`, and `en/changelog/` are empty directories. `MKT-008`..`013` have not started.

`Locales` counts locales _implemented and enforced_, not per-item translation completeness: English and Spanish both ship with explicit locale context, route-parity validation, canonical/`hreflang` metadata, and translation-freshness checks (`I18N-001`..`004`), and `beta:acceptance:report` asserts 45/45 locale-parity checks. Per-item Spanish review remains part of each catalog item's Definition of Done in §8.5 — and per `I18N-005`, 0 of 171 records are `human-reviewed` — so this row reading 2 does not imply the catalog is reviewed-bilingual.

---

## 12. Immediate implementation command sequence

After `SITE-001` creates `@solidiom/site`, the expected local checks are:

```sh
pnpm install
pnpm --filter @solidiom/site check
pnpm --filter @solidiom/site build
pnpm --filter @solidiom/site dev
```

As Nx targets land, prefer:

```sh
pnpm exec nx run @solidiom/site:check
pnpm exec nx run @solidiom/site:build
pnpm exec nx run @solidiom/site:search-index
pnpm exec nx run @solidiom/site:e2e
```

Use single-run test commands in CI. Do not start watch mode unless explicitly requested.

### 12.1 Re-verifying this document

The status recorded above was produced by running the following against a clean build. Re-run them before editing any status column; they take roughly 25 minutes end to end on a warm workspace.

```sh
# Does the CI configuration even load? Check this first — see CI-005.
python3 -c 'import yaml; yaml.safe_load(open(".github/workflows/ci.yml"))'
pnpm run format:check

# Is the latest CI run at HEAD, and did it finish? A green ancestor proves nothing
# about enforcement that a later commit added.
gh run list --limit 5 --json databaseId,headSha,conclusion; git rev-parse HEAD

# Library and website gates
pnpm run gate:phase1              # expect 253 passed, 1 failed (CLI-011 regression)
pnpm run gate:phase3              # expect 21/21, re-runs phase 0/1/2
pnpm run gate:vertical-slice      # expect 67/67; §11 delegates to PRIM-000
pnpm run primitive:catalog-gate   # expect 52/52 against §11's DoD column
pnpm run component:catalog-gate   # expect 0/30 — ratchet holds (FOUND-004)
pnpm run block:catalog-gate       # expect 0/36 — ratchet holds (FOUND-005)
pnpm run test:tools               # expect 35 files / 382 tests

# Contract, theme, recipe, and provenance audits
pnpm run recipe:contract
pnpm run recipe:emit:css:check && pnpm run recipe:emit:tailwind:check && pnpm run recipe:emit:unocss:check
pnpm run theme:emit:css:check && pnpm run theme:emit:tailwind:check && pnpm run theme:emit:unocss:check
pnpm run audit:recipe-parity && pnpm run audit:theme-parity && pnpm run audit:preset-themes
pnpm run audit:package-source-parity && pnpm run assert:no-unverified && pnpm run api:coverage-gate

# Site build, then everything that reads apps/site/dist
pnpm --filter @solidiom/site build && pnpm --filter @solidiom/site search-index
pnpm --filter @solidiom/site run translation:check    # locale/DoD status for §8.5
pnpm run beta:acceptance:report                       # expect 60/60
PLAYWRIGHT_USE_EXISTING_BUILD=1 pnpm run beta:acceptance:e2e          # expect 111/111
PLAYWRIGHT_USE_EXISTING_BUILD=1 pnpm --filter @solidiom/site test:e2e # expect 435/435
pnpm run visual:container                             # 36/36 in the pinned image; a bare test:visual fails off-Linux
```

Build the site before the acceptance and visual runs: `beta:acceptance:report` reads `apps/site/dist` directly, and `PLAYWRIGHT_USE_EXISTING_BUILD=1` tells the Playwright configs to serve that directory instead of rebuilding it per suite.

Several of the commands above **write to tracked files** rather than only reporting: `gate:vertical-slice`, `gate:phase1`, `pnpm build`, `report:a11y-evidence`, and `audit:adapter-styling` all regenerate committed artifacts. Against the current tree they leave it clean — verified after each of `gate:phase1`, `gate:vertical-slice`, and `audit:adapter-styling` — because generation stamps and evidence provenance are now preserved when content is unchanged and the `BUILD-001` step in CI fails on any residual diff. Churn here therefore means a real content change, not noise. Check `git status` after a verification pass and decide deliberately what it means; **do not `git checkout -- docs/` or any other broad path to clean it**, or you will revert this document along with it:

```sh
pnpm run report:a11y-evidence && pnpm run registry:build
git status --short -- registry/ 'packages/*/docs/accessibility/' packages/unocss-preset/source
```
