# Solidiom Website — Implementation Tasks

**Status:** ready to execute
**Source plan:** `docs/website-imp.md`
**Visual reference:** `docs/solidiom/solidiom-site.png`
**Target application:** `apps/site/`
**Canonical origin:** `https://solidiom.org`

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

| Gate | Milestone                       | Exit condition                                                                                                                             | Primary blockers                                 |
| ---- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| G0   | Governance and canonical inputs | Brand, licensing, security, privacy, migration, and account prerequisites are explicit.                                                    | External policy review and domain/account access |
| G1   | Foundation/private alpha shell  | `apps/site` builds, deploys to preview, supports both locales/themes, and dogfoods Solidiom.                                               | Site scaffold, tokens, shell, CI                 |
| G2   | Content-platform vertical slice | Dialog, Combobox, and Data Table prove registry → routes → API → examples → a11y → i18n → search.                                          | Registry v2, TypeDoc, a11y, content loaders      |
| G3   | Public beta platform            | Useful catalog subset, CLI flows, themes, playground/theme-builder betas, marketing, privacy, and analytics are live with maturity labels. | G2 plus recipe/CLI/tool foundations              |
| G4   | Catalog completion              | 52 primitives, 21 components, 36+ blocks, 29 templates/32 placements, four themes, and both languages meet item DoDs.                      | Catalog work queues and smoke matrices           |
| G5   | GA and cutover                  | Full quality, security, browser, performance, legal, SEO, and migration gates pass; legacy apps are removed.                               | G4 plus hardening and production readiness       |

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

---

## 4. M0 — Governance and canonical inputs

| Status | ID        | Size | Depends on | Owner area       | Task and acceptance boundary                                                                                                                               |
| ------ | --------- | ---- | ---------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | GOV-001   | S    | —          | Governance       | Define MIT code/output, CC BY 4.0 documentation, and reserved-brand boundaries; identify required notices.                                                 |
| [ ]    | GOV-002   | S    | —          | Security         | Publish the private vulnerability-reporting process in `SECURITY.md`.                                                                                      |
| [ ]    | GOV-003   | S    | GOV-001    | Governance       | Add DCO signoff instructions and contribution provenance requirements to contributing guidance.                                                            |
| [ ]    | GOV-004   | M    | —          | Privacy/product  | Define the PostHog allowlist and prohibited payloads in a typed event-schema proposal; autocapture/session replay remain disabled.                         |
| [ ]    | GOV-005   | S    | GOV-004    | Privacy/product  | Draft privacy disclosures for Cloudflare, PostHog, Buttondown, Pagefind, playground, and theme-builder behavior.                                           |
| [ ]    | GOV-006   | S    | GOV-001    | Brand/governance | Draft the Solidiom trademark and brand-use policy; document ecosystem-logo criteria.                                                                       |
| [ ]    | BRAND-001 | S    | —          | Design systems   | Update the written brand specification to exactly match the board palette and typography roles.                                                            |
| [ ]    | BRAND-002 | M    | BRAND-001  | Design systems   | Define site-local semantic tokens in `apps/site/src/assets/tokens.css`, including independent light/dark surface hierarchies.                              |
| [ ]    | BRAND-003 | S    | BRAND-001  | Design systems   | Select, pin, self-host, and preload Inter Tight, Inter Variable, and IBM Plex Mono assets with documented licenses.                                        |
| [ ]    | BRAND-004 | M    | BRAND-001  | Brand/design     | Create vector icon, wordmark, monochrome/light/dark variants, favicon set, and social-card source assets.                                                  |
| [ ]    | MIG-001   | M    | —          | Platform/content | Create `docs/website-migration-inventory.md` covering all `apps/docs` routes, demos, reports, and behavior.                                                |
| [ ]    | MIG-002   | XS   | MIG-001    | Repository       | Mark `apps/docs` read-only for new features in its package documentation/ownership guidance.                                                               |
| [ ]    | BASE-001  | S    | —          | QA/platform      | Capture the reproducible `apps/docs-astro-poc` validation baseline.                                                                                        |
| [ ]    | BASE-002  | S    | —          | Platform         | Reconcile workspace Solid 2 catalog/override versions with direct versions in `apps/docs`; record migration constraints without changing the POC baseline. |
| [ ]    | OPS-001   | XS   | —          | Operations       | Confirm `solidiom.org` and Cloudflare access ownership.                                                                                                    |
| [ ]    | OPS-002   | S    | OPS-001    | Operations       | Define preview, production, DNS, redirect, header, CSP, rollback, and secret-management responsibilities.                                                  |

### G0 exit checklist

- [ ] Palette, type, licensing, trademark, privacy, security, and DCO policies have owners.
- [ ] POC baseline is reproducible.
- [ ] Legacy-app parity inventory is complete.
- [ ] Domain/Cloudflare prerequisites are assigned.
- [ ] No production secret or provider key is stored in the repository.

---

## 5. M1 — Foundation and private alpha shell

### 5.1 Application and workspace

| Status | ID       | Size | Depends on                     | Owner area    | Task and acceptance boundary                                                                                                         |
| ------ | -------- | ---- | ------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [x]    | SITE-001 | S    | —                              | Platform      | Create `apps/site` using only POC configuration/integration wiring; package name `@solidiom/site`; retain POC unchanged.             |
| [x]    | SITE-002 | S    | SITE-001                       | Platform      | Add package scripts and Nx metadata for `dev`, `check`, `build`, `preview`, and `search-index`; declare outputs/cache inputs.        |
| [ ]    | SITE-003 | S    | SITE-002                       | Platform/QA   | Establish one static route, Astro check, production build, and Pagefind generation as the green baseline.                            |
| [ ]    | SITE-004 | M    | SITE-003, BRAND-002, BRAND-003 | Frontend      | Implement base HTML/layout, metadata defaults, font preloads, no-flash locale/theme bootstrap, skip link, and focus root.            |
| [ ]    | SITE-005 | M    | SITE-004                       | Frontend      | Implement responsive header/global nav with Solidiom Button, Navigation Menu/Menu, and Dialog/Drawer primitives.                     |
| [ ]    | SITE-006 | S    | SITE-004                       | Frontend      | Implement footer, legal/community links, newsletter slot, and responsive behavior; GitHub only.                                      |
| [ ]    | SITE-007 | M    | SITE-004                       | Frontend      | Implement documentation shell: generated sidebar slot, article column, TOC slot, mobile nav, and scroll/focus behavior.              |
| [ ]    | SITE-008 | M    | SITE-004                       | Frontend      | Implement typography/prose/code styles, Shiki theme pair, copy control, heading anchors, tables, callouts, and print styles.         |
| [ ]    | SITE-009 | S    | SITE-004                       | Frontend      | Implement persistent system/light/dark selection before paint with no hydration mismatch.                                            |
| [ ]    | SITE-010 | S    | SITE-004                       | Frontend      | Add 404, error-safe static fallback, robots, sitemap baseline, manifest, canonical URL helper, and social metadata helper.           |
| [ ]    | SITE-011 | M    | SITE-005, SITE-007             | Accessibility | Verify shell keyboard order, landmarks, zoom, reduced motion, contrast, mobile/touch, and current/previous browser support.          |
| [ ]    | SITE-012 | S    | SITE-003                       | Architecture  | Add import-boundary rules so static routes cannot import playground/theme-builder/editor/compiler modules.                           |
| [ ]    | SITE-013 | S    | SITE-003                       | Performance   | Add route bundle/hydration reporting and capture initial content/catalog/tool budgets for later CI enforcement.                      |
| [ ]    | SITE-014 | S    | MIG-001                        | Migration     | Audit each reusable `apps/docs` demo/component for migrate, rewrite, or retire; no direct copy without current behavior/a11y review. |

### 5.2 Locale foundation

| Status | ID       | Size | Depends on         | Owner area       | Task and acceptance boundary                                                                                                    |
| ------ | -------- | ---- | ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | I18N-001 | M    | SITE-003           | Platform/content | Implement locale configuration: English unprefixed, Spanish `/es/`, explicit locale context, no automatic redirect.             |
| [ ]    | I18N-002 | S    | I18N-001, SITE-005 | Frontend         | Implement accessible language switcher with equivalent-route mapping and persisted explicit choice.                             |
| [ ]    | I18N-003 | M    | I18N-001           | Content platform | Add canonical/`hreflang` helpers, translated metadata requirements, fallback diagnostics, and route-parity validation.          |
| [ ]    | I18N-004 | M    | I18N-001           | Content platform | Define translation source hashes, statuses (`draft`, `human-reviewed`, `stale`), terminology glossary, and GA freshness policy. |

### 5.3 Test, CI, and preview foundation

| Status | ID       | Size | Depends on         | Owner area  | Task and acceptance boundary                                                                                                      |
| ------ | -------- | ---- | ------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | TEST-001 | S    | SITE-003           | QA          | Add site unit/browser test configuration without coupling it to the legacy Vite docs app.                                         |
| [ ]    | TEST-002 | M    | SITE-005, SITE-007 | QA          | Update Playwright config to start `@solidiom/site` on a dedicated port and cover Chromium, Firefox, and WebKit shell smoke tests. |
| [ ]    | TEST-003 | M    | SITE-004           | QA/design   | Add visual baseline harness for desktop/tablet/mobile × light/dark × English/Spanish; store only intentional reference images.    |
| [ ]    | TEST-004 | S    | SITE-013           | Performance | Add Lighthouse and bundle-report scripts with report artifacts; thresholds remain advisory until G2.                              |
| [ ]    | CI-001   | S    | SITE-002           | CI          | Add pull-request and main-branch triggers to `.github/workflows/ci.yml` while retaining manual dispatch.                          |
| [ ]    | CI-002   | M    | TEST-001, TEST-002 | CI          | Add site check/build/e2e jobs with cached dependencies and failure artifacts.                                                     |
| [ ]    | CI-003   | S    | TEST-003, TEST-004 | CI          | Add visual/Lighthouse report jobs in advisory mode.                                                                               |
| [ ]    | CI-004   | S    | SITE-003           | CI          | Ensure Solid-matrix jobs explicitly include/exclude `@solidiom/site` according to supported integration behavior.                 |
| [ ]    | OPS-003  | M    | OPS-002, SITE-003  | Operations  | Configure Cloudflare Pages preview deployment and verify headers, redirects, asset caching, and preview access policy.            |

### G1 exit checklist

- [ ] Static `apps/site` builds independently and through Nx.
- [ ] English and Spanish shell routes render with canonical and `hreflang` metadata.
- [ ] Theme and locale selection apply before paint and persist.
- [ ] Header, mobile navigation, theme switch, and language switch use Solidiom interactions.
- [ ] Preview deployment and cross-browser shell tests pass.
- [ ] POC remains unchanged and legacy docs remain available/read-only.

---

## 6. M2 — Content platform and vertical slice

### 6.1 Registry and integrity

| Status | ID      | Size | Depends on | Owner area        | Task and acceptance boundary                                                                                                                           |
| ------ | ------- | ---- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ ]    | REG-001 | M    | —          | Registry/platform | Design registry schema v2 and migration rules.                                                                                                         |
| [ ]    | REG-002 | M    | REG-001    | Registry/platform | Implement versioned schema/types/validation in `tools/registry-build.ts`; preserve current 52 primitives and 6 adapters.                               |
| [ ]    | REG-003 | M    | REG-002    | Registry/platform | Add deliverables, documentation status, locale status, search, evidence, theme, and provenance fields sourced from package metadata/content manifests. |
| [ ]    | REG-004 | S    | REG-002    | Registry/platform | Add deterministic output, stable sorting, schema version checks, and fixture/snapshot tests.                                                           |
| [ ]    | REG-005 | M    | REG-002    | Security/CLI      | Generate per-file digests and signed versioned index metadata compatible with existing CLI verify/Sigstore dependencies.                               |
| [ ]    | REG-006 | M    | REG-005    | CLI/security      | Extend `packages/cli` verification to fail closed on missing/invalid signatures, hashes, or pinned metadata; add tamper tests.                         |
| [ ]    | REG-007 | S    | REG-003    | CI                | Add invariant: each public deliverable generates exactly one valid route; missing/duplicate routes fail CI.                                            |

### 6.2 Content collections and route generation

| Status | ID          | Size | Depends on            | Owner area       | Task and acceptance boundary                                                                                                                                         |
| ------ | ----------- | ---- | --------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | CONTENT-001 | M    | SITE-003, REG-002     | Content platform | Configure Astro loaders for site-wide content and `packages/*/docs/**` without copying package docs into the app.                                                    |
| [ ]    | CONTENT-002 | M    | CONTENT-001, I18N-004 | Content platform | Define versioned frontmatter schemas for guides, primitive prose, examples, accessibility contracts, components, blocks, templates, themes, articles, and changelog. |
| [ ]    | CONTENT-003 | S    | CONTENT-002           | Content platform | Add content validation for required metadata, unique slugs, product identity, status, dates, and locale parity.                                                      |
| [ ]    | CONTENT-004 | S    | CONTENT-002           | Content platform | Add source-hash and translation-freshness generator; stale/missing GA translations fail validation.                                                                  |
| [ ]    | CONTENT-005 | S    | CONTENT-002           | Content platform | Define code/example source extraction so displayed code and executable examples share a canonical source.                                                            |

### 6.3 API and accessibility evidence

| Status | ID       | Size | Depends on            | Owner area    | Task and acceptance boundary                                                                                                                                    |
| ------ | -------- | ---- | --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | API-001  | M    | SITE-002              | API platform  | Select and pin TypeDoc; add Nx `api` target with declared inputs/outputs and package-build dependencies.                                                        |
| [ ]    | API-002  | L    | API-001               | API platform  | Define and implement versioned Solidiom API schema normalization for components, contexts, functions, props, children, inheritance, comments, and source links. |
| [ ]    | API-003  | M    | API-002, SITE-008     | Frontend/API  | Build static Astro API renderers, heading extraction, deep links, copy actions, and empty/error diagnostics.                                                    |
| [ ]    | API-004  | S    | API-002               | CI            | Fail on undocumented/unresolved public exports; snapshot normalized Dialog, Combobox, and Data Table outputs.                                                   |
| [ ]    | API-005  | S    | API-003, I18N-001     | Content       | Translate API explanatory UI while preserving identifiers, signatures, attributes, and source literals.                                                         |
| [ ]    | A11Y-001 | M    | SITE-002              | Accessibility | Extend existing axe artifacts to emit stable per-primitive evidence IDs and machine-readable result summaries.                                                  |
| [ ]    | A11Y-002 | M    | A11Y-001, CONTENT-002 | Accessibility | Define authored contract schema: keyboard, focus, semantics, ARIA, consumer duties, non-applicable criteria, and review status.                                 |
| [ ]    | A11Y-003 | M    | A11Y-002, SITE-008    | Frontend/a11y | Build static accessibility renderer combining authored contract and generated evidence without overstating conformance.                                         |
| [ ]    | A11Y-004 | S    | A11Y-001              | CI            | Make missing/stale evidence fail for GA-status entries; retain artifact provenance and CI run links.                                                            |
| [ ]    | A11Y-005 | M    | A11Y-003              | Accessibility | Define manual evidence matrix for keyboard, focus, zoom, contrast, reduced motion, screen readers, and touch.                                                   |
| [ ]    | A11Y-006 | S    | A11Y-002, I18N-004    | Content       | Add bilingual accessibility terminology and human-review checklist.                                                                                             |

### 6.4 Catalog routes, navigation, and search

| Status | ID         | Size | Depends on                     | Owner area       | Task and acceptance boundary                                                                                                         |
| ------ | ---------- | ---- | ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [ ]    | DOCS-001   | M    | REG-003, CONTENT-001, SITE-007 | Frontend         | Generate primitive directory and `/primitives/[name]/` overview routes from registry/content data.                                   |
| [ ]    | DOCS-002   | M    | DOCS-001, API-003, A11Y-003    | Frontend         | Generate static `/api/`, `/examples/`, and `/accessibility/` routes styled as tabs.                                                  |
| [ ]    | DOCS-003   | M    | DOCS-001                       | Frontend         | Generate sidebar groups, active state, mobile navigation, previous/next links, and right-side TOC from metadata/headings.            |
| [ ]    | DOCS-004   | M    | DOCS-001                       | Frontend         | Implement directory filters and status/category UI as progressively enhanced Solid islands with static fallback links.               |
| [ ]    | DOCS-005   | S    | REG-003                        | Frontend         | Render install command, package/version/status, source files, dependencies, capabilities, and integrity metadata from registry only. |
| [ ]    | DOCS-006   | S    | DOCS-002, I18N-003             | SEO/content      | Add structured data, canonical links, locale alternates, breadcrumbs, and social metadata for catalog pages.                         |
| [ ]    | SEARCH-001 | S    | SITE-003                       | Search           | Separate Astro build from Pagefind indexing and expose explicit Nx `search-index` target.                                            |
| [ ]    | SEARCH-002 | M    | SEARCH-001, SITE-005           | Search/frontend  | Build Solidiom command/search dialog; do not reuse corvu implementation or Pagefind default visual UI.                               |
| [ ]    | SEARCH-003 | M    | SEARCH-002, REG-003            | Search           | Index/filter guides, catalog entries, APIs, examples, a11y, themes, blog, changelog, and migrations by content type and locale.      |
| [ ]    | SEARCH-004 | S    | SEARCH-003                     | Accessibility/QA | Add keyboard, focus restoration, no-results, static fallback, and bilingual result tests.                                            |
| [ ]    | SEARCH-005 | S    | SEARCH-003, GOV-004            | Privacy          | Emit only allowlisted search-open/result-selected events; never emit query text.                                                     |

### 6.5 Complex vertical slice

| Status | ID     | Size | Depends on                                 | Owner area       | Task and acceptance boundary                                                                                                                                  |
| ------ | ------ | ---- | ------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | VS-001 | L    | DOCS-001..006, API-001..005, A11Y-001..006 | Cross-functional | Complete Dialog end to end in English/Spanish, including live example, all static tabs, API, evidence, search, theme modes, and install metadata.             |
| [ ]    | VS-002 | L    | VS-001                                     | Cross-functional | Complete Combobox end to end; prove complex state, keyboard model, collections, and API normalization.                                                        |
| [ ]    | VS-003 | L    | VS-001                                     | Cross-functional | Complete Data Table end to end; prove adapters, large API, responsive preview, and data-boundary documentation.                                               |
| [ ]    | VS-004 | M    | VS-001, VS-002, VS-003                     | QA/platform      | Add end-to-end vertical-slice gate: route counts, links, search, API snapshots, a11y artifacts, locale parity, visual/browser tests, and performance budgets. |

### G2 exit checklist

- [ ] Registry v2 regenerates all current entries deterministically.
- [ ] Dialog, Combobox, and Data Table satisfy the Primitive DoD in both languages.
- [ ] API, a11y, search, routes, and translations are generated from canonical sources.
- [ ] Numeric content/catalog performance budgets are enforced.
- [ ] No bulk catalog work has bypassed the vertical-slice gate.

---

## 7. M3 — Public beta platform

### 7.1 Canonical recipes and CLI

| Status | ID         | Size | Depends on               | Owner area        | Task and acceptance boundary                                                                                                                     |
| ------ | ---------- | ---- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ ]    | RECIPE-001 | L    | REG-003                  | Design systems    | Define canonical recipe contract for semantic slots, variants, states, compound variants, scopes/parts, and adapter exceptions.                  |
| [ ]    | RECIPE-002 | M    | RECIPE-001               | Design systems    | Implement CSS emitter and migrate existing CSS recipe metadata without behavior drift.                                                           |
| [ ]    | RECIPE-003 | M    | RECIPE-001               | Design systems    | Implement Tailwind emitter and migrate existing recipes; generated output must match the canonical contract.                                     |
| [ ]    | RECIPE-004 | L    | RECIPE-001               | Design systems    | Implement UnoCSS emitter/preset; close the current gap where `recipes-unocss` has no equivalent recipe catalog.                                  |
| [ ]    | RECIPE-005 | M    | RECIPE-002..004          | QA/design systems | Extend recipe contract/dual-emission audits to three outputs, semantic slots, states, and documented exceptions.                                 |
| [ ]    | RECIPE-006 | S    | RECIPE-002..004          | Build             | Preserve `src/`/`source/` parity and package exports for recipe packages; add parity checks to CI.                                               |
| [ ]    | CLI-001    | S    | —                        | CLI               | Establish canonical CLI source tree and update workflow for duplicated `src/` and `source/`; retain package-source parity.                       |
| [ ]    | CLI-002    | M    | REG-003, CLI-001         | CLI               | Teach `plan`, `inspect`, and `add` about product-layer deliverables and styling outputs.                                                         |
| [ ]    | CLI-003    | M    | REG-006, CLI-002         | CLI/security      | Require verified manifests/hashes before source installation and preserve lock/provenance records.                                               |
| [ ]    | CLI-004    | M    | CLI-002, RECIPE-002..004 | CLI               | Add source-owned component/block/theme install flow with destination, conflict, diff, and rollback behavior.                                     |
| [ ]    | CLI-005    | M    | CLI-001                  | CLI               | Add package-manager detection and normalized npm/pnpm/Yarn/Bun command execution helpers.                                                        |
| [ ]    | CLI-006    | M    | CLI-005                  | CLI               | Add `solidiom create --template <name>` command skeleton, destination safety, prompts, non-interactive flags, and cancellation cleanup.          |
| [ ]    | CLI-007    | L    | CLI-006, REG-003         | CLI/templates     | Implement template materialization, substitutions, config generation, dependency installation option, and existing-path refusal/override policy. |
| [ ]    | CLI-008    | M    | CLI-007                  | QA/CLI            | Build offline fixtures and smoke harness for all four package managers; no foreign lockfile may be emitted.                                      |
| [ ]    | CLI-009    | S    | CLI-002..008             | Documentation     | Document init/add/create/plan/verify/diff/update flows and failure recovery in both languages.                                                   |
| [ ]    | CLI-010    | M    | CLI-002..008             | QA                | Extend command unit/integration tests, AST rewrite tests, tamper tests, and package-source parity coverage.                                      |

### 7.2 Theme presets and builder foundation

| Status | ID          | Size | Depends on                   | Owner area           | Task and acceptance boundary                                                                                                   |
| ------ | ----------- | ---- | ---------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [ ]    | THEME-001   | M    | BRAND-002, RECIPE-001        | Design systems       | Define versioned semantic theme JSON schema, validation, migration, and light/dark requirements.                               |
| [ ]    | THEME-002   | M    | THEME-001                    | Design systems       | Generate CSS variables from canonical theme JSON.                                                                              |
| [ ]    | THEME-003   | M    | THEME-001                    | Design systems       | Generate Tailwind mapping from canonical theme JSON.                                                                           |
| [ ]    | THEME-004   | M    | THEME-001                    | Design systems       | Generate UnoCSS preset/configuration from canonical theme JSON.                                                                |
| [ ]    | THEME-005   | M    | THEME-002..004               | QA/design systems    | Add cross-output parity, contrast, required-token, and round-trip validation.                                                  |
| [ ]    | BUILDER-001 | M    | SITE-012, THEME-001          | Tools/frontend       | Create route-local Solid theme-builder shell with no imports in static route chunks.                                           |
| [ ]    | BUILDER-002 | L    | BUILDER-001                  | Tools/frontend       | Implement grouped token editor, validation messages, reset/undo, keyboard flow, and responsive UI.                             |
| [ ]    | BUILDER-003 | M    | BUILDER-001, required COMP-* | Tools/design systems | Implement representative component preview grid across light/dark and interaction states.                                      |
| [ ]    | BUILDER-004 | M    | THEME-002..004, BUILDER-002  | Tools                | Implement import/export for JSON, CSS, Tailwind, and UnoCSS with deterministic output.                                         |
| [ ]    | BUILDER-005 | M    | BUILDER-002                  | Tools/security       | Implement versioned URL-encoded share state with size limits, validation, malformed-input handling, and no server persistence. |
| [ ]    | BUILDER-006 | M    | BUILDER-001..005             | QA                   | Add accessibility, browser, privacy, visual, and route-bundle tests.                                                           |

### 7.3 Curated playground

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

### 7.4 Marketing, editorial, analytics, and newsletter

| Status | ID            | Size | Depends on        | Owner area            | Task and acceptance boundary                                                                                                                               |
| ------ | ------------- | ---- | ----------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | MKT-001       | L    | G1, BRAND-004     | Marketing/frontend    | Implement responsive homepage faithful to the board: hero, proof, starting layers, compatibility, ownership, catalog/theme/tool previews, CTA, and footer. |
| [ ]    | MKT-002       | M    | REG-003, SITE-004 | Marketing/frontend    | Implement Primitives, Components, Blocks, Templates, and Themes landing/directory shells with accurate status/counts.                                      |
| [ ]    | MKT-003       | M    | CONTENT-002       | Content               | Implement Getting Started, Architecture, Styling, Composition, SSR, Testing, and Migration guide skeletons.                                                |
| [ ]    | MKT-004       | M    | A11Y-003          | Content/accessibility | Implement accessibility landing page using real evidence and documented consumer responsibilities.                                                         |
| [ ]    | MKT-005       | S    | REG-003           | Content               | Implement registry/CLI explanation and signed-source ownership flow.                                                                                       |
| [ ]    | MKT-006       | M    | GOV-002, REG-003  | Content               | Implement technical Enterprise page: architecture, security, versioning, governance, migration, and accessibility; no sales/SLA claims.                    |
| [ ]    | MKT-007       | S    | GOV-003           | Community             | Implement GitHub-only Community and Contributing pages; remove Discord/inactive social placeholders.                                                       |
| [ ]    | MKT-008       | M    | CONTENT-002       | Editorial             | Publish foundational article: Solid 2 architecture.                                                                                                        |
| [ ]    | MKT-009       | M    | CONTENT-002       | Editorial             | Publish foundational article: accessible interaction contracts.                                                                                            |
| [ ]    | MKT-010       | M    | CONTENT-002       | Editorial             | Publish foundational article: source ownership.                                                                                                            |
| [ ]    | MKT-011       | M    | CONTENT-002       | Editorial             | Publish foundational article: styling-system neutrality.                                                                                                   |
| [ ]    | MKT-012       | M    | CONTENT-002       | Editorial             | Publish foundational article: building with Solidiom.                                                                                                      |
| [ ]    | MKT-013       | S    | CONTENT-002       | Editorial             | Implement changelog and migration content types, feeds, archive pages, and structured metadata.                                                            |
| [ ]    | ANALYTICS-001 | M    | GOV-004, SITE-004 | Privacy/platform      | Implement typed PostHog adapter with autocapture/session replay disabled and environment-safe no-op behavior.                                              |
| [ ]    | ANALYTICS-002 | S    | ANALYTICS-001     | QA/privacy            | Add payload tests proving prohibited fields cannot be emitted.                                                                                             |
| [ ]    | ANALYTICS-003 | S    | ANALYTICS-001     | Operations            | Configure production key/domain through Cloudflare environment settings; no key in source.                                                                 |
| [ ]    | NEWS-001      | M    | GOV-005, SITE-006 | Frontend/privacy      | Implement Buttondown form, explicit consent, validation, loading/success/error/confirmation behavior, and no analytics leakage.                            |
| [ ]    | NEWS-002      | S    | NEWS-001          | QA                    | Add keyboard, error, localization, privacy, and external-endpoint integration tests/mocks.                                                                 |

### 7.5 Beta gate

| Status | ID       | Size | Depends on                                                     | Owner area | Task and acceptance boundary                                                                                 |
| ------ | -------- | ---- | -------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| [ ]    | BETA-001 | M    | G2, representative COMP/BLOCK/TPL tasks, PLAY-007, BUILDER-006 | Product/QA | Define beta minimum coverage and publish maturity labels; no dead CTA or implied GA completeness.            |
| [ ]    | BETA-002 | M    | BETA-001, MKT-001..013                                         | QA         | Run beta acceptance matrix across locales, themes, browsers, search, CLI, tools, privacy, and accessibility. |
| [ ]    | BETA-003 | S    | BETA-002, OPS-003                                              | Operations | Publish public beta with rollback, incident contact, feedback path, and release notes.                       |

---

## 8. Shared catalog-item Definitions of Done

### 8.1 Primitive item DoD

Each `PRIM-*` work package is complete only when:

- Registry/package metadata, status, version, category, dependencies, capabilities, source files, and integrity data are current.
- English overview, Spanish human-reviewed overview, installation, behavior, composition, styling, SSR/hydration, testing, relationships, and migration notes exist.
- Generated API is complete and source-linked.
- At least one production-quality executable example and canonical source view exist.
- Authored accessibility contract and current automated/manual evidence exist.
- Overview/API/Examples/Accessibility routes, sidebar, TOC, search, metadata, and locale alternates work.
- Light/dark, mobile, keyboard, zoom, browser, and visual checks pass.
- Primitive completion, package tests, typecheck, build, link, and content validations pass.

### 8.2 Component item DoD

Each `COMP-*` work package is complete only when:

- It has a canonical recipe contract and generated CSS/Tailwind/UnoCSS outputs.
- Existing CSS/Tailwind recipes are migrated rather than forked when applicable.
- States, variants, slots, composition, disabled/loading/error behavior, and theme compatibility are tested.
- It uses the corresponding Solidiom primitive and introduces no duplicate behavior layer.
- CLI plan/add/verify/diff/update flows work with signed manifests and source ownership.
- English/Spanish docs, examples, accessibility evidence, source preview, and theme previews pass.

### 8.3 Block item DoD

Each `BLOCK-*` work package is complete only when:

- A concrete product outcome/name is assigned in `BLOCK-000`; no placeholder ships.
- Full-page and embedded previews exist with responsive/mobile behavior.
- Loading, empty, error, and permission-restricted states are implemented.
- Primitive/component dependency maps, files/routes added, and data-boundary assumptions are explicit.
- Canonical recipes generate CSS/Tailwind/UnoCSS forms where applicable.
- CLI add/verify/diff/update, bilingual docs, accessibility evidence, browser/visual tests, and integrity checks pass.

### 8.4 Template item DoD

Each `TPL-*` work package is complete only when:

- It targets exactly one documented stack: SolidStart, TanStack Start Solid, or Vite + Solid Router.
- Router, data fetching, authn/authz, styling, theme, package manager, deployment, included blocks, and replaceable boundaries are explicit.
- `solidiom create --template` succeeds with npm, pnpm, Yarn, and Bun without a foreign lockfile.
- Generated project builds, typechecks, starts, and passes its smoke/a11y tests in offline fixtures.
- English/Spanish docs, screenshots, security/data assumptions, provenance, and signed manifest pass.
- Shared portfolio concepts use one canonical template unless a materially different architecture is approved.

### 8.5 Translation item DoD

- English source hash matches the reviewed Spanish translation record.
- A fluent human reviewer confirms terminology, technical meaning, accessibility guidance, metadata, and examples.
- Code, APIs, commands, attributes, and package names are not translated.
- Route parity, links, search inclusion, canonical/`hreflang`, and layout stress tests pass.

---

## 9. M4 — Catalog completion work queues

### 9.1 Primitive queue — 52

All tasks depend on `VS-004`. Dialog, Combobox, and Data Table may close from their vertical-slice work once the full Primitive DoD passes.

| Status | ID       | Primitive        | Size | Depends on     |
| ------ | -------- | ---------------- | ---- | -------------- |
| [ ]    | PRIM-001 | Accordion        | M    | VS-004         |
| [ ]    | PRIM-002 | Alert            | M    | VS-004         |
| [ ]    | PRIM-003 | Alert Dialog     | M    | VS-004         |
| [ ]    | PRIM-004 | Avatar           | M    | VS-004         |
| [ ]    | PRIM-005 | Badge            | M    | VS-004         |
| [ ]    | PRIM-006 | Breadcrumb       | M    | VS-004         |
| [ ]    | PRIM-007 | Button           | M    | VS-004         |
| [ ]    | PRIM-008 | Calendar         | L    | VS-004         |
| [ ]    | PRIM-009 | Card             | M    | VS-004         |
| [ ]    | PRIM-010 | Carousel         | L    | VS-004         |
| [ ]    | PRIM-011 | Checkbox         | M    | VS-004         |
| [ ]    | PRIM-012 | Collapsible      | M    | VS-004         |
| [ ]    | PRIM-013 | Combobox         | L    | VS-002, VS-004 |
| [ ]    | PRIM-014 | Command Palette  | L    | VS-004         |
| [ ]    | PRIM-015 | Context Menu     | L    | VS-004         |
| [ ]    | PRIM-016 | Data Table       | L    | VS-003, VS-004 |
| [ ]    | PRIM-017 | Date Picker      | L    | VS-004         |
| [ ]    | PRIM-018 | Dialog           | L    | VS-001, VS-004 |
| [ ]    | PRIM-019 | Drawer           | L    | VS-004         |
| [ ]    | PRIM-020 | Empty State      | M    | VS-004         |
| [ ]    | PRIM-021 | Field            | M    | VS-004         |
| [ ]    | PRIM-022 | Hover Card       | M    | VS-004         |
| [ ]    | PRIM-023 | Input            | M    | VS-004         |
| [ ]    | PRIM-024 | Input OTP        | L    | VS-004         |
| [ ]    | PRIM-025 | Kbd              | S    | VS-004         |
| [ ]    | PRIM-026 | Label            | S    | VS-004         |
| [ ]    | PRIM-027 | Listbox          | L    | VS-004         |
| [ ]    | PRIM-028 | Menu             | L    | VS-004         |
| [ ]    | PRIM-029 | Meter            | M    | VS-004         |
| [ ]    | PRIM-030 | Navigation Menu  | L    | VS-004         |
| [ ]    | PRIM-031 | Pagination       | M    | VS-004         |
| [ ]    | PRIM-032 | Popover          | M    | VS-004         |
| [ ]    | PRIM-033 | Progress         | M    | VS-004         |
| [ ]    | PRIM-034 | Radio Group      | M    | VS-004         |
| [ ]    | PRIM-035 | Resizable Panels | L    | VS-004         |
| [ ]    | PRIM-036 | Scroll Area      | M    | VS-004         |
| [ ]    | PRIM-037 | Select           | L    | VS-004         |
| [ ]    | PRIM-038 | Separator        | S    | VS-004         |
| [ ]    | PRIM-039 | Sheet            | L    | VS-004         |
| [ ]    | PRIM-040 | Skeleton         | M    | VS-004         |
| [ ]    | PRIM-041 | Slider           | L    | VS-004         |
| [ ]    | PRIM-042 | Spinner          | M    | VS-004         |
| [ ]    | PRIM-043 | Switch           | M    | VS-004         |
| [ ]    | PRIM-044 | Tabs             | M    | VS-004         |
| [ ]    | PRIM-045 | Toast            | L    | VS-004         |
| [ ]    | PRIM-046 | Toggle           | M    | VS-004         |
| [ ]    | PRIM-047 | Toggle Group     | M    | VS-004         |
| [ ]    | PRIM-048 | Toolbar          | L    | VS-004         |
| [ ]    | PRIM-049 | Tooltip          | M    | VS-004         |
| [ ]    | PRIM-050 | Tree             | L    | VS-004         |
| [ ]    | PRIM-051 | Virtual List     | L    | VS-004         |
| [ ]    | PRIM-052 | Visually Hidden  | S    | VS-004         |

### 9.2 Component queue — 21

`Baseline` describes current recipe evidence, not completion. Existing recipes must migrate to the canonical contract and add UnoCSS.

| Status | ID       | Component       | Baseline               | Size | Depends on                     |
| ------ | -------- | --------------- | ---------------------- | ---- | ------------------------------ |
| [ ]    | COMP-001 | Button          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-007           |
| [ ]    | COMP-002 | Input           | New                    | M    | RECIPE-005, PRIM-023           |
| [ ]    | COMP-003 | Field           | New                    | L    | RECIPE-005, PRIM-021, COMP-002 |
| [ ]    | COMP-004 | Card            | New                    | M    | RECIPE-005, PRIM-009           |
| [ ]    | COMP-005 | Alert           | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-002           |
| [ ]    | COMP-006 | Dialog          | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-018           |
| [ ]    | COMP-007 | Select          | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-037           |
| [ ]    | COMP-008 | Dropdown Menu   | Existing `menu` recipe | L    | RECIPE-005, PRIM-028           |
| [ ]    | COMP-009 | Tabs            | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-044           |
| [ ]    | COMP-010 | Toast           | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-045           |
| [ ]    | COMP-011 | Tooltip         | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-049           |
| [ ]    | COMP-012 | Avatar          | New                    | M    | RECIPE-005, PRIM-004           |
| [ ]    | COMP-013 | Checkbox        | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-011           |
| [ ]    | COMP-014 | Radio Group     | New                    | M    | RECIPE-005, PRIM-034           |
| [ ]    | COMP-015 | Switch          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-043           |
| [ ]    | COMP-016 | Combobox        | New                    | L    | RECIPE-005, PRIM-013           |
| [ ]    | COMP-017 | Popover         | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-032           |
| [ ]    | COMP-018 | Sheet           | New                    | L    | RECIPE-005, PRIM-039           |
| [ ]    | COMP-019 | Navigation Menu | New                    | L    | RECIPE-005, PRIM-030           |
| [ ]    | COMP-020 | Breadcrumb      | New                    | M    | RECIPE-005, PRIM-006           |
| [ ]    | COMP-021 | Pagination      | New                    | M    | RECIPE-005, PRIM-031           |

### 9.3 Block queue — 36 minimum

First complete `BLOCK-000`. It assigns a concrete name, outcome, required states, component dependencies, and data boundary to every reserved slot. Each row then instantiates the Block DoD.

| Status | ID                | Category / slot                        | Size | Depends on                     |
| ------ | ----------------- | -------------------------------------- | ---- | ------------------------------ |
| [ ]    | BLOCK-000         | Approve 36-item block catalog manifest | L    | representative COMP-* complete |
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

Complete `TPL-000` first to assign stack, required blocks, deployment target, auth model, and portfolio tags. Shared templates are implemented once and appear in both portfolios.

| Status | ID      | Template                                         | Portfolio             | Size | Depends on                |
| ------ | ------- | ------------------------------------------------ | --------------------- | ---- | ------------------------- |
| [ ]    | TPL-000 | Approve template architecture/portfolio manifest | L                     | Both | CLI-008, BLOCK-000        |
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
| [ ]    | PRESET-001  | Ocean preset, docs, previews, outputs                                                    | M    | THEME-005                  |
| [ ]    | PRESET-002  | Forest preset, docs, previews, outputs                                                   | M    | THEME-005                  |
| [ ]    | PRESET-003  | Slate preset, docs, previews, outputs                                                    | M    | THEME-005                  |
| [ ]    | PRESET-004  | Aurora preset, docs, previews, outputs                                                   | M    | THEME-005                  |
| [ ]    | PRESET-005  | Cross-preset contrast/coverage/translation gate                                          | M    | PRESET-001..004            |
| [ ]    | BUILDER-007 | Complete representative preview coverage for all 21 components                           | L    | BUILDER-003, COMP-001..021 |
| [ ]    | BUILDER-008 | Publish bilingual builder docs, privacy model, limitations, and migration/version policy | M    | BUILDER-004..007           |

### G4 exit checklist

- [ ] `PRIM-001..052` complete: exactly 52/52.
- [ ] `COMP-001..021` complete: exactly 21/21.
- [ ] At least 36 named `BLOCK-*` items complete, three or more per category.
- [ ] `TPL-001..029` complete and exposed as 32 portfolio placements.
- [ ] All template × package-manager smoke combinations pass.
- [ ] Four presets and full builder satisfy English/Spanish, theme, accessibility, browser, and output gates.
- [ ] No placeholder block name, stale translation, unsigned manifest, or maturity exception remains.

---

## 10. M5 — GA hardening and cutover

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

- [ ] Every acceptance criterion in `docs/website-imp.md` §14 passes.
- [ ] No temporary dogfooding, maturity, translation, security, accessibility, or performance exception remains.
- [ ] Production deployment and rollback are rehearsed.
- [ ] Legacy docs and POC are removed only after parity verification.
- [ ] `solidiom.org` is canonical and all redirects/locale alternates resolve correctly.

---

## 11. Progress rollup

Update this table when tasks move; do not infer completion from generated files alone.

| Milestone                 | Status      | Gate | Completion evidence                              |
| ------------------------- | ----------- | ---- | ------------------------------------------------ |
| M0 Governance/inputs      | Not started | G0   | Policies, baseline, inventory, accounts          |
| M1 Foundation/alpha shell | In progress | G1   | SITE-001 scaffold and SITE-002 targets validated; static baseline pending |
| M2 Content vertical slice | Not started | G2   | Three complex primitives pass end to end         |
| M3 Public beta platform   | Not started | G3   | Beta acceptance matrix and deployment            |
| M4 Catalog completion     | Not started | G4   | Exact catalog counts and item DoDs               |
| M5 GA/cutover             | Not started | G5   | Full acceptance matrix and production deployment |

### Scope counters

| Scope                         | Required | Complete |
| ----------------------------- | -------: | -------: |
| Primitives                    |       52 |        0 |
| Components                    |       21 |        0 |
| Blocks                        |     ≥ 36 |        0 |
| Unique templates              |       29 |        0 |
| Template portfolio placements |       32 |        0 |
| Theme presets                 |        4 |        0 |
| Foundational articles         |        5 |        0 |
| Locales                       |        2 |        0 |

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
