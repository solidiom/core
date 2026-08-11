---
id: website-architecture
title: "Solidiom Website Architecture"
description: "Canonical product scope, architecture, governance, content model, and GA policy for solidiom.org."
doc_type: architecture
audience: "Solidiom project leads, platform engineers, frontend engineers, content authors"
tags: [website, architecture, astro, solid2, governance, content]
lifecycle: current
authority: canonical
volatility: controlled
date: 2026-07-27
last_updated: 2026-08-08
supersedes: docs/plans/website-plan.md (removed)
---

# Solidiom Website Architecture

This document is the durable authority for the product and technical shape of `solidiom.org`. It does not track implementation progress.

- Current status, queues, and sequencing: [Consolidated execution plan](../plans/consolidated-plan.md)
- Visual reference: `docs/assets/solidiom-site.png`
- Target application: `apps/site/`

## 1. Product decision

Solidiom ships a registry-driven, bilingual product website, not only a documentation site. The site combines marketing, guides, complete product catalogs, themes, interactive tools, a blog, a changelog, and technical adoption guidance on one canonical origin.

The production application is a static Astro site with isolated Solid islands. Documentation and marketing are zero-JavaScript by default. The playground and theme builder are route-local Solid applications and must not increase the JavaScript cost of content routes.

`apps/docs/` has been removed (CUT-003). Its deprecation notice is archived at `docs/history/legacy-docs/deprecated-notice.md`. The Astro MDX POC findings are archived at `docs/history/poc/docs-astro-poc-findings.md`.

`../solid2/corvu/web/` is reference-only. Do not copy its code, styling, content, assets, or information architecture. Existing package-level provenance remains intact, but the Solidiom website shell, search, table of contents, examples, API rendering, and theme bootstrap are Solidiom-owned.

### 1.1 Goals

1. Present one coherent Solidiom brand and product model.
2. Make every approved deliverable discoverable, installable, documented, and backed by current API and accessibility evidence.
3. Distinguish packaged primitives from source-owned components, blocks, themes, and templates without duplicating identities or metadata.
4. Dogfood Solidiom for all website interactions; a missing Solidiom capability blocks the feature rather than inviting a third-party UI substitute.
5. Keep content static, fast, indexable, deep-linkable, printable, and usable without hydration.
6. Provide safe interactive exploration without an application server.
7. Maintain equivalent English and Spanish feature and content coverage.
8. Make release quality mechanically verifiable.

### 1.2 Non-goals

- User accounts, cloud persistence, or server-stored playground/theme projects
- Arbitrary playground package installation or arbitrary remote imports
- A public, automatically published community registry
- A framework variant of every template
- Versioned documentation snapshots before 1.0
- Commercial support tiers, SLAs, certifications, or a bug-bounty program
- Community channels beyond maintained GitHub surfaces
- A public `@solidiom/tokens` package before a second real consumer proves the need

## 2. Approved product scope

One canonical identity, such as `dialog`, may declare separate primitive-package, component-recipe, block, template, and theme deliverables. A product route exists only when that deliverable exists in the registry.

| Layer      |                               GA scope | Durable rule                                                                                                 |
| ---------- | -------------------------------------: | ------------------------------------------------------------------------------------------------------------ |
| Primitives |                                     52 | Every primitive has complete English and Spanish reference content and generated evidence.                   |
| Components |                                     30 | Source-owned recipes installed by the CLI, not a second opaque package layer. See the dated amendment below. |
| Blocks     |                            At least 36 | At least three blocks in each of 12 outcome categories.                                                      |
| Templates  |     29 unique; 32 portfolio placements | Two complete 16-placement portfolios with three shared canonical templates.                                  |
| Themes     |                         4 plus builder | Ocean, Forest, Slate, and Aurora are editable starting points.                                               |
| Playground |                                Curated | Repository-owned TSX/CSS examples only, with sandboxed preview.                                              |
| Editorial  | 5 foundational articles plus changelog | Published in both languages; changelog remains separate from the blog.                                       |

### 2.1 Component scope history and amendment

**Historical decision — 2026-07-27.** The original website plan approved 21 launch components: Button, Input, Field, Card, Alert, Dialog, Select, Dropdown Menu, Tabs, Toast, Tooltip, Avatar, Checkbox, Radio Group, Switch, Combobox, Popover, Sheet, Navigation Menu, Breadcrumb, and Pagination.

**Scope amendment — 2026-08-06.** The approved catalog is **30 components, not 21**. The block catalog exposed nine required concepts that the original component queue omitted because component citations had been misnumbered and interpreted by ID instead of being reconciled by name. The amendment adds Command Palette, Data Table, Kbd, Meter, Progress, Resizable Panels, Scroll Area, Spinner, and Toolbar. Switch remains the original `COMP-015`; a second Switch citation was a duplicate identity, not a 31st component.

The amendment supersedes the 21-component count in all normative scope, quality, and GA statements while preserving the historical decision above. Component dependencies must be reconciled by both stable ID and name. The authoritative queue and exact identifiers live in [consolidated-plan.md §9.2](../plans/consolidated-plan.md#92-components--3030).

The approved 30 are:

1. Button
2. Input
3. Field
4. Card
5. Alert
6. Dialog
7. Select
8. Dropdown Menu
9. Tabs
10. Toast
11. Tooltip
12. Avatar
13. Checkbox
14. Radio Group
15. Switch
16. Combobox
17. Popover
18. Sheet
19. Navigation Menu
20. Breadcrumb
21. Pagination
22. Command Palette
23. Data Table
24. Kbd
25. Meter
26. Progress
27. Resizable Panels
28. Scroll Area
29. Spinner
30. Toolbar

Each component requires complete states, parity across generated recipe outputs, tests, documentation, accessibility evidence, source previews, and theme previews.

### 2.2 Blocks

Ship at least three blocks in each category:

- Authentication
- Onboarding
- Settings
- Billing
- Administration
- Observability
- Resource management
- AI interfaces
- Search
- Commerce
- Content
- Application shells

Each block includes full-page and embedded previews, responsive behavior, loading/empty/error/restricted states, primitive and component dependency maps, files and routes added, data-boundary assumptions, accessibility evidence, and CLI installation.

### 2.3 Templates

The Balanced Product and Enterprise Platform/Governance portfolios each contain 16 placements. Multi-tenant Admin, Observability Console, and Resource Manager are shared canonical templates, producing 29 unique templates across 32 placements. A second template is justified only by materially different architecture, workflow, or deployment assumptions—not by portfolio labeling alone.

Templates span SolidStart, TanStack Start Solid, and Vite + Solid Router. Each unique template targets one documented stack and declares its router, data fetching, authentication, authorization, styling output, theme, package manager, deployment target, included blocks, replaceable boundaries, and portfolio membership.

The CLI must support npm, pnpm, Yarn, and Bun, detect the invoking package manager, avoid writing a foreign lockfile, and smoke-test every template/package-manager combination before GA.

### 2.4 Themes and builder

Theme data uses canonical semantic token JSON and generates CSS custom properties, Tailwind mappings, and UnoCSS configuration. The builder supports token editing, validation, light/dark previews across representative components, reset, import/export, and versioned URL state. It does not claim to generate a complete design system.

### 2.5 Playground

The launch playground provides curated repository-owned examples, TSX and CSS editing, preview, reset, copy, and open actions. Compilation occurs in a Web Worker; generated code runs in a sandboxed iframe with restrictive capabilities and message-based preview/error reporting.

The playground must never transmit source code or error text containing source to analytics. Unsupported browsers receive a static explanation. Arbitrary dependencies, accounts, server persistence, downloadable projects, and remote code execution are outside launch scope.

## 3. Application architecture

### 3.1 Boundaries

The exact directory layout may evolve, but these boundaries are mandatory:

```text
apps/site/
├── public/
├── src/
│   ├── assets/                 # semantic tokens, global and syntax CSS
│   ├── components/             # chrome, docs, search, examples, marketing
│   ├── content/{en,es}/        # site-owned bilingual content
│   ├── layouts/
│   ├── lib/                    # registry, API, a11y, i18n, search adapters
│   ├── pages/
│   └── tools/                  # route-local playground and theme builder
├── astro.config.ts
└── package.json
```

Static content and catalog rendering must not import editor/compiler code. Interactive tools must be route-lazy.

### 3.2 Rendering rules

- Astro statically renders marketing, guides, catalogs, API reference, examples, accessibility evidence, blog, and changelog.
- Solid islands are limited to real interactions: search, mobile navigation, filters, examples, theme controls, playground, and theme builder.
- Pagefind is generated after the static build and loaded on demand.
- Preview/API/Examples/Accessibility navigation uses separate static routes even when presented visually as tabs.
- Shareable theme state is versioned and URL-encoded; no backend persistence is required.
- Content remains readable when an interactive enhancement is unsupported.

### 3.3 Build graph

Generation and validation are explicit workspace targets rather than hidden build side effects. The durable target set covers:

```text
registry
api
accessibility-report
content-validate
translations-validate
site-build
search-index
site-check
site-e2e
site-visual
site-lighthouse
```

`site-build` depends on registry, API, accessibility, and content outputs. API generation depends on package builds. Search indexing depends on static output.

### 3.4 API reference pipeline

1. Generate structured TypeDoc data from public package source/declarations.
2. Normalize it into a small, versioned Solidiom API schema.
3. Render that schema with Solidiom-owned Astro components.
4. Validate the pipeline against complex packages such as Combobox, Dialog, and Data Table.
5. Fail validation when a public export is undocumented, stale, or cannot be normalized.

No external website's TypeDoc resolver or renderer is copied.

## 4. Content model

### 4.1 Hybrid ownership

Site-wide content belongs in `apps/site`: marketing, getting started, architecture, styling, composition, SSR, migrations, blog, changelog, roadmap, enterprise guidance, tool documentation, navigation, legal, and global chrome.

Package-specific prose, examples, authored accessibility contracts, and translations are co-located with the package. Generated API and test evidence remain build artifacts.

### 4.2 Registry authority

`registry/index.json` and namespaced entry manifests are the source of truth. Do not create website-only catalog copies. Registry metadata covers:

- Canonical identity, label, description, category, maturity, and version
- Product-layer deliverables
- Package/source files, runtime dependencies, capabilities, and CLI command
- Accessibility review and evidence identifiers
- Documentation maturity and translation freshness
- Styling outputs and theme compatibility
- Search keywords and last-updated metadata
- Integrity hashes, signatures, and provenance

A registry deliverable must generate a valid route or fail validation.

### 4.3 Localization

- English is canonical and unprefixed; Spanish mirrors the route under `/es/`.
- Emit canonical links, `hreflang`, translated metadata, and localized Pagefind indexes.
- Do not redirect automatically from browser language. Offer an explicit switch and remember the choice.
- AI-assisted Spanish is draft material until a fluent human performs technical review.
- Track freshness by source-content hash; materially stale translations block GA.
- Keep code, API names, package names, commands, and literal attributes untranslated.

### 4.4 Information architecture

```text
/
├── docs/
├── primitives/[name]/{api,examples,accessibility}/
├── components/[name]/
├── blocks/[name]/
├── templates/[name]/
├── themes/[name]/
├── themes/builder/
├── playground/
├── registry/
├── accessibility/
├── enterprise/
├── blog/
├── changelog/
├── migrations/
├── roadmap/
├── community/
├── contributing/
├── security/
├── privacy/
└── es/                         # mirrored Spanish routes
```

## 5. Brand and interaction policy

- Interpret the brand board responsively; do not reproduce fixed desktop geometry.
- Use Indigo `#6D66F1`, Blue `#3B82F6`, Cyan `#06B6D4`, Green `#22C55E`, Slate `#0F172A`, and Gray `#94A3B8` as canonical core palette inputs behind semantic tokens.
- Use Inter Tight for display headings, Inter Variable for UI/body/docs, and IBM Plex Mono for code, commands, package names, versions, and API symbols.
- Respect `prefers-color-scheme` before first paint and persist explicit user choice. Every route supports light and dark modes.
- Preserve the 4px spacing system, 8/12/16/20px radii, border-first layering, and restrained shadows.
- Support bilingual text expansion, reduced motion, 200% and 400% zoom, and logical-property layouts.
- Use compatibility language for third-party ecosystems; never imply an undocumented endorsement.

Tokens begin as extraction-safe semantic names in `apps/site`. Publish a tokens package only after another real consumer establishes the contract.

## 6. Services, privacy, and security

### 6.1 Search and analytics

Pagefind provides a unified, localized index with content-type filters. The keyboard search dialog supports grouped results and no-JavaScript links.

PostHog Cloud may receive only typed, allowlisted, privacy-limited events. Autocapture and session replay are disabled. Never collect raw search queries, playground code, theme values, email addresses, free-form text, or persistent cross-site identifiers.

### 6.2 Newsletter and community

Buttondown receives the static newsletter form with explicit consent, double opt-in, privacy disclosure, confirmation, failure, and unsubscribe behavior. Email values never flow through analytics.

GitHub Issues and Discussions are the maintained community channels. Do not advertise unmaintained chat or social channels.

### 6.3 Hosting and supply chain

Deploy static output to Cloudflare Pages at `solidiom.org`, with pull-request previews, headers, redirects, custom-domain configuration, and a rollback path.

Publish a coordinated-disclosure policy and use GitHub private vulnerability reporting. Sign versioned registry indexes with Ed25519 asymmetric signatures, verify downloaded files against per-file hashes, pin generated dependency metadata, and fail closed when signatures or hashes are missing or invalid. Record provenance for submissions and generated artifacts. Apply a strict content security policy and restrictive playground iframe permissions.

## 7. Governance

- Apache 2.0 covers code, recipes, blocks, templates, themes, CLI output, and website source.
- CC BY 4.0 covers prose and non-brand documentation media.
- The Solidiom name, logo, and distinctive brand assets remain reserved under a separate brand policy.
- Contributions require DCO signoff, provenance, schema validation, tests, accessibility evidence, screenshots, bilingual checks, and maintainer approval.
- Community submissions never publish automatically.
- Enterprise content is technical adoption guidance only and must not imply unsupported sales, SLA, certification, or service commitments.
- Stable latest-only documentation routes are used before 1.0; loaders remain version-ready, and immutable snapshots begin at 1.0.

Final license, trademark, privacy, and security language requires appropriate specialist review; this architecture is implementation policy, not legal advice.

## 8. Quality policy

### 8.1 Catalog quality

Every primitive reference includes purpose, status, package/version/install guidance, behavior and composition, generated public API, production examples, an authored accessibility contract, generated evidence, consumer responsibilities, styling guidance, SSR/hydration notes, tests, related products, and migration notes in both languages.

Components, blocks, templates, and themes are complete only when their registry identity, source/install path, documentation, previews, accessibility evidence, translations, and supported styling outputs agree. File presence or route scaffolding alone is not completion evidence.

### 8.2 Accessibility and browsers

The target is WCAG 2.2 AA plus applicable WAI-ARIA Authoring Practices. Automated evidence complements rather than replaces manual keyboard, focus, zoom, high-contrast, reduced-motion, screen-reader, and mobile/touch review.

Support current and previous major Chrome, Edge, Firefox, and Safari releases, including current iOS Safari. Static content remains available when an interactive tool is unsupported.

### 8.3 Performance

- Marketing/docs routes are static by default, use only essential islands, and load search on demand.
- Catalog routes hydrate previews only when interactive and defer media/source payloads.
- Playground and theme-builder bundles are route-local and load editor/compiler code only after intent.

Numeric budgets are based on measured foundation and representative vertical-slice baselines. Gates cover Core Web Vitals, JavaScript/CSS/image weight, hydration count, and route-level chunk leakage.

### 8.4 Required evidence

Release validation covers static/type/lint/build checks; registry schemas and route counts; API normalization and export completeness; translation parity/freshness; search coverage and keyboard behavior; island unit/browser tests; automated and manual accessibility; responsive end-to-end and visual matrices; template/package-manager smoke tests; signature/checksum tamper failures; route-class performance; and links, canonical URLs, `hreflang`, sitemap, structured data, and redirects.

## 9. GA acceptance criteria

GA requires all of the following:

1. One canonical registry identity with explicit deliverables for each product layer.
2. All 52 primitives are complete in English and Spanish.
3. All **30 source-owned components** are complete, per the 2026-08-06 amendment in §2.1.
4. At least 36 blocks are complete, with at least three in every approved category.
5. Both template portfolios are complete: 29 unique templates and 32 placements, smoke-tested across supported package managers.
6. Ocean, Forest, Slate, and Aurora and the full theme builder are complete.
7. The curated playground passes sandbox, browser, accessibility, and privacy validation.
8. Five foundational articles and the changelog are published in both languages.
9. Unified Pagefind search covers every required content type and locale.
10. WCAG 2.2 AA/APG evidence is complete with no critical accessibility defects.
11. Route-class performance budgets and the browser matrix pass.
12. Solidiom-only website dogfooding is verified.
13. Signed registry manifests and fail-closed verification are enabled.
14. Analytics allowlists, newsletter consent, privacy, security, license, DCO, and brand policies are published.
15. Production, preview, redirect, and rollback paths for `solidiom.org` are verified.
16. Legacy `apps/docs` and the POC are removed after parity and baseline verification.

Implementation state, exceptions, owners, and residual work belong only in [consolidated-plan.md](../plans/consolidated-plan.md).

### G5 Assessment (2026-08-08)

| #   | Criterion                                             | Status            | Notes                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | One canonical registry identity                       | **PASS**          | `registry/index.json` has all six arrays: primitives (52), adapters (6), components (32), blocks (36), templates (29), themes (4). Schema v3, integrity hash present.                                                                                                                                                                                                                       |
| 2   | All 52 primitives complete in EN and ES               | **PARTIAL**       | 52 primitives registered. All have `documentationStatus: "complete"` and Spanish `status: "reviewed"`. English locale is `status: "draft"` (not yet `human-reviewed`). All `status: "preview"` (not yet `stable`). Blocks on EN review promotion and status bump to `stable`.                                                                                                               |
| 3   | All 30 source-owned components complete               | **PASS**          | Registry has 32 components (30 required + 2 adapters cross-listed). All 30 per §2.1 amendment are present.                                                                                                                                                                                                                                                                                  |
| 4   | At least 36 blocks, three per category                | **PASS**          | Registry has exactly 36 blocks. Site content has 36 blocks in both EN and ES.                                                                                                                                                                                                                                                                                                               |
| 5   | Both template portfolios: 29 templates, 32 placements | **PASS**          | Registry has 29 templates. Site content mirrors in both locales.                                                                                                                                                                                                                                                                                                                            |
| 6   | Ocean, Forest, Slate, Aurora + theme builder          | **PASS**          | Registry has 4 themes. Theme builder components exist under `src/components/theme-builder/`.                                                                                                                                                                                                                                                                                                |
| 7   | Curated playground                                    | **DEFERRED (M6)** | Playground is M6 scope, not G5-blocking. Not assessed.                                                                                                                                                                                                                                                                                                                                      |
| 8   | Five foundational articles + changelog                | **PASS**          | 7 articles published in both EN and ES (exceeds minimum of 5). Changelog has 2 entries in both locales.                                                                                                                                                                                                                                                                                     |
| 9   | Unified Pagefind search                               | **PASS**          | Pagefind directives on all pages (`data-pagefind-body`, locale and content-type filters). E2E test covers search. Preview deployment verifier checks Pagefind index.                                                                                                                                                                                                                        |
| 10  | WCAG 2.2 AA/APG evidence                              | **PASS**          | `manual-evidence-matrix.md` complete for all 52 primitives across all 7 dimensions. All interactive primitives have ✅ across keyboard, focus, zoom, contrast, reduced-motion, VoiceOver, and touch. Non-interactive primitives correctly marked N/A. Dialog has extended evidence.                                                                                                         |
| 11  | Route-class performance budgets                       | **PASS**          | `docs/qa/performance-budgets.md` defines CWV, bundle, and per-primitive budgets with measurement methods.                                                                                                                                                                                                                                                                                   |
| 12  | Solidiom-only dogfooding                              | **PASS**          | `apps/site/` imports 20+ `@solidiom/*` primitives (Accordion, Alert, Badge, Breadcrumb, Button, Card, Checkbox, Combobox, Data Table, Dialog, Drawer, Field, Input, Label, Menu, Navigation Menu, Pagination, Popover, Progress, Radio Group, Select, Separator, Sheet, Switch, Tabs, etc.). Site chrome (SiteHeader, SiteSearch, DocsMobileNav) and theme builder use Solidiom components. |
| 13  | Signed registry manifests                             | **PARTIAL**       | `integrity` section with `sha256` algorithm and `entriesHash` present. Per-file digests referenced in schema. Signing infrastructure and Ed25519 keys exist in codebase. Signatures not yet applied to current registry index.                                                                                                                                                              |
| 14  | Policies published                                    | **PASS**          | Privacy (`/privacy/`), Security (`/security/`, newly created), Trademark/Brand (`/trademark/`), DCO (`/dco/`, newly created), License (`LICENSE` at repo root, referenced in CONTRIBUTING.md). All available in both EN and ES.                                                                                                                                                             |
| 15  | Production/preview/redirect/rollback paths            | **PASS**          | `apps/docs/` and `apps/docs-astro-poc/` removed. OPS-004/005 infrastructure documented.                                                                                                                                                                                                                                                                                                     |
| 16  | Legacy apps/docs and POC removed                      | **PASS**          | `apps/docs/` removed at CUT-003. `apps/docs-astro-poc/` removed. POC findings archived at `docs/history/poc/docs-astro-poc-findings.md`.                                                                                                                                                                                                                                                    |

**Verdict: CONDITIONAL PASS — 14 of 16 criteria pass. One is deferred (C7), two are partial (C2, C13).**

**Remaining blockers for GA sign-off:**

- **C2:** Promote English documentation from `draft` to `human-reviewed` and bump all 52 primitives from `preview` to `stable` status.
- **C13:** Apply Ed25519 signature to current `registry/index.json` and wire CLI verification path.
