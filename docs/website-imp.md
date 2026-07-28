# Solidiom Website — Implementation Plan

**Status:** decisions complete; ready for task decomposition
**Last updated:** 2026-07-27
**Canonical origin:** `https://solidiom.org`
**Architecture:** static Astro 7 site with isolated Solid 2 islands
**Visual reference:** `docs/solidiom/solidiom-site.png`

---

## 1. Executive decision

Promote the validated architecture in `apps/docs-astro-poc/` into a production application at `apps/site/`. The site will be a registry-driven, bilingual product website—not only a documentation site—and will include marketing, guides, 52 complete primitive references, 21 source-owned components, 36 or more production blocks, 29 unique templates spanning complete 16-item Balanced Product and Enterprise Platform/Governance portfolios, four themes plus a full theme builder, and a curated interactive playground.

`../solid2/corvu/web/` is **reference-only**. No code, styling, content, assets, or information architecture will be copied from it. Search, table of contents, examples, API rendering, theme bootstrapping, and the website shell will be implemented specifically for Solidiom.

The site will deploy as static output to Cloudflare Pages. Documentation and marketing remain zero-JavaScript by default; `/playground/` and `/themes/builder/` are isolated Solid applications loaded only on their routes.

---

## 2. Resolved decision record

There are no open product or architecture decisions in this plan.

### 2.1 Foundation and migration

| Area          | Decision                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Application   | Create `apps/site/` from only the validated configuration and minimal integration setup in `apps/docs-astro-poc/`.                                                             |
| POC lifecycle | Keep `apps/docs-astro-poc/` unchanged as a comparison baseline until `apps/site` passes equivalent checks; archive `FINDINGS.md`, then delete the POC.                         |
| Legacy app    | Freeze `apps/docs/` for new features. Maintain a route/feature/content parity inventory and delete it only after verified migration.                                           |
| corvu         | Reference-only; copy no implementation. No website-level corvu provenance or attribution is required. Existing provenance in `packages/astrojs-solid-next/` remains unchanged. |
| Dogfooding    | Solidiom-only interactions from the first private alpha. A missing primitive/component blocks the website feature instead of being replaced by third-party UI.                 |
| Scheduling    | Capacity-neutral milestones with person-week ranges, plus illustrative one-engineer and small-team projections.                                                                |

### 2.2 Brand and presentation

| Area              | Decision                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual fidelity   | System-faithful responsive interpretation of the brand board, not fixed desktop pixel matching.                                                                                                                                                       |
| Palette           | Keep semantic token names, but use the brand board's canonical core values: Indigo `#6D66F1`, Blue `#3B82F6`, Cyan `#06B6D4`, Green `#22C55E`, Slate `#0F172A`, Gray `#94A3B8`. Update `docs/solidiom/README.md` and eliminate near-duplicate values. |
| Token location    | Begin at `apps/site/src/assets/tokens.css`, with extraction-safe names and no site-only selectors. Publish `@solidiom/tokens` only when a second real consumer exists.                                                                                |
| Typography        | Inter Tight for display headings; Inter Variable for UI, body, and documentation; IBM Plex Mono for code, commands, packages, versions, and API symbols.                                                                                              |
| Color mode        | Respect `prefers-color-scheme` before first paint and persist explicit user choice. Every route supports light and dark modes.                                                                                                                        |
| Styling outputs   | Define one canonical recipe contract and generate CSS, Tailwind, and UnoCSS outputs. Adapter-specific exceptions must be explicit and tested.                                                                                                         |
| Third-party logos | Use compatibility language such as “Built for the Solid ecosystem,” never implied endorsement. Show only tested integrations and follow trademark rules.                                                                                              |

### 2.3 Content and product scope

| Area          | Decision                                                                                                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product model | One canonical identity (for example `dialog`) can declare separate primitive-package, component-recipe, block, and template deliverables. Generate a product route only when that deliverable exists.                                                                                                            |
| Primitives    | All 52 registry primitives must have complete English and Spanish documentation at GA.                                                                                                                                                                                                                           |
| Components    | Launch 21 production-ready, CLI-copied components.                                                                                                                                                                                                                                                               |
| Blocks        | Launch 36 or more blocks: at least three in each of 12 outcome categories.                                                                                                                                                                                                                                       |
| Templates     | Launch both complete 16-item portfolios: Balanced Product and Enterprise Platform/Governance. Three concepts are shared, producing 29 unique templates and 32 portfolio placements. Templates span SolidStart, TanStack Start Solid, and Vite + Solid Router; each unique template targets one documented stack. |
| Themes        | Ship Ocean, Forest, Slate, and Aurora plus a full theme builder.                                                                                                                                                                                                                                                 |
| Playground    | Ship a curated interactive sandbox with controlled examples, TSX/CSS editing, preview, reset, copy, and open actions.                                                                                                                                                                                            |
| Blog          | Launch five foundational articles plus a separate changelog.                                                                                                                                                                                                                                                     |
| Enterprise    | Technical adoption guidance only; no unsupported sales, SLA, certification, or service claims.                                                                                                                                                                                                                   |
| Versioning    | Use stable latest-only routes during prerelease; make loaders version-ready; begin immutable snapshots at 1.0.                                                                                                                                                                                                   |

### 2.4 Operations and governance

| Area          | Decision                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Languages     | English canonical and unprefixed; Spanish under `/es/`. AI-assisted Spanish drafts require fluent human technical review.                                                                 |
| Search        | Unified Pagefind index with content-type filters. Never send raw search queries to analytics.                                                                                             |
| Hosting       | Cloudflare Pages at `solidiom.org`, with pull-request previews, headers, redirects, and custom-domain configuration.                                                                      |
| Newsletter    | Buttondown static form integration with double opt-in, consent text, privacy disclosure, confirmation, and unsubscribe support.                                                           |
| Analytics     | PostHog Cloud with autocapture disabled. Only allowlisted, privacy-limited events; no session replay or free-form user payloads.                                                          |
| Community     | GitHub Issues and Discussions only. Do not advertise Discord or other unmaintained channels.                                                                                              |
| Contributions | Curated GitHub pull requests with schemas, provenance, tests, accessibility evidence, screenshots, bilingual checks, maintainer review, and DCO signoff. Nothing publishes automatically. |
| Licensing     | MIT for code, recipes, blocks, templates, and website source; CC BY 4.0 for prose and non-brand documentation media; brand marks reserved under a separate policy.                        |
| Security      | GitHub private vulnerability reporting plus `SECURITY.md`; signed registry manifests, per-file checksums, pinned dependency metadata, and fail-closed CLI verification.                   |
| Accessibility | WCAG 2.2 AA plus applicable WAI-ARIA Authoring Practices, backed by automated and manual evidence.                                                                                        |
| Browsers      | Current and previous major Chrome, Edge, Firefox, and Safari, including current iOS Safari. Static content remains readable when an interactive tool is unsupported.                      |

---

## 3. Goals and non-goals

### 3.1 GA goals

1. Present the complete Solidiom brand and product model on one origin.
2. Make every existing primitive discoverable, installable, documented, and supported by current API and accessibility evidence.
3. Distinguish packaged behavior from source-owned components, blocks, themes, and templates without duplicating identities or metadata.
4. Prove Solidiom through strict website dogfooding.
5. Keep content routes static, fast, indexable, deep-linkable, printable, and usable without hydration.
6. Provide safe interactive exploration without adding an application server.
7. Deliver feature and content parity in English and Spanish.
8. Make release quality mechanically verifiable in CI.

### 3.2 Explicit GA non-goals

- User accounts, cloud persistence, or server-stored playground/theme projects.
- Arbitrary playground package installation or arbitrary remote imports.
- A public, automatically published community registry.
- Equivalent framework variants for every template.
- Documentation snapshots before 1.0.
- Commercial support tiers, SLAs, certifications, or a bug-bounty program.
- Social/community channels beyond GitHub.
- A public `@solidiom/tokens` package before another consumer proves the need.

---

## 4. Architecture

### 4.1 Application topology

```text
apps/site/
├── astro.config.ts
├── public/
├── src/
│   ├── assets/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── syntax.css
│   ├── components/
│   │   ├── chrome/
│   │   ├── docs/
│   │   ├── search/
│   │   ├── examples/
│   │   └── marketing/
│   ├── content/
│   │   ├── config.ts
│   │   ├── en/
│   │   └── es/
│   ├── layouts/
│   ├── lib/
│   │   ├── registry/
│   │   ├── typedoc/
│   │   ├── accessibility/
│   │   ├── i18n/
│   │   └── search/
│   ├── pages/
│   └── tools/
│       ├── playground/
│       └── theme-builder/
└── package.json
```

The final structure may vary, but boundaries must remain explicit: static content and catalog rendering must not import editor/compiler code, and interactive tools must be route-lazy.

### 4.2 Rendering rules

- Astro renders marketing, guides, catalogs, API reference, examples, accessibility evidence, blog, and changelog statically.
- Solid islands are limited to actual interactions: search dialog, mobile navigation, filters, examples, theme controls, playground, and theme builder.
- The playground compiler runs in a Web Worker. Generated code executes in a sandboxed iframe with restrictive capabilities and message-based preview/error reporting.
- The theme builder is a route-local Solid island. Shareable configurations use versioned URL-encoded state; no backend persistence is required.
- Pagefind is generated after the Astro build and loaded on demand.

### 4.3 Nx targets

Add explicit targets rather than hiding generation inside `build`:

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

`site-build` depends on registry, API, accessibility, and content outputs. API generation depends on package builds. Search indexing depends on static site output.

### 4.4 API generation

1. Add TypeDoc and generate structured JSON from package source/declarations.
2. Normalize TypeDoc output into a small, versioned Solidiom API schema.
3. Render that schema with Solidiom-owned Astro components.
4. Validate first against complex packages such as Combobox, Dialog, and Data Table—not Button alone.
5. Fail the build if a public export is undocumented, stale, or cannot be normalized.

No corvu TypeDoc resolver or renderer code will be copied.

---

## 5. Content ownership and metadata

### 5.1 Hybrid ownership

Site-wide content remains in `apps/site`:

- Homepage and marketing pages
- Getting started, architecture, styling, composition, SSR, migrations
- Blog, changelog, roadmap, enterprise guidance
- Theme-builder and playground documentation
- Global navigation, footer, and legal content

Package-specific content is co-located:

```text
packages/dialog/
├── source/
├── docs/
│   ├── overview.mdx
│   ├── accessibility.mdx
│   ├── examples/
│   └── es/
└── package.json
```

Co-location applies to primitive/component prose, examples, authored accessibility contracts, and package-specific translation. Generated API and test evidence remain build artifacts.

### 5.2 Registry as source of truth

Extend `registry/index.json` and per-entry manifests rather than maintaining website-only copies. Required metadata includes:

- Canonical identity, label, description, category, status, and version
- Product-layer deliverables (`primitive`, `component`, `block`, `template`, `theme`)
- Package, source files, runtime dependencies, capabilities, and CLI command
- Accessibility review and evidence identifiers
- Documentation maturity and translation freshness
- Styling outputs and theme compatibility
- Search keywords and last-updated metadata
- Integrity hashes, manifest signature, and provenance

A new registry entry must either generate a valid route or fail CI.

### 5.3 Localization

- English routes are canonical and unprefixed.
- Spanish routes use `/es/` and retain matching route structure.
- Emit `hreflang`, canonical links, translated titles/descriptions, and localized Pagefind indexes.
- Never redirect automatically based on browser language; offer an explicit switch and remember the choice.
- English is the source of truth. AI-assisted Spanish is a draft only.
- Fluent human review is mandatory for technical meaning, terminology, examples, accessibility instructions, metadata, and search text.
- Translation freshness is tracked by source-content hash; materially stale content blocks GA.
- Code, API names, package names, commands, and literal attributes remain untranslated.

---

## 6. Information architecture and routes

```text
/
├── docs/
├── primitives/
│   └── [name]/
│       ├── index.html              # Preview/overview
│       ├── api/
│       ├── examples/
│       └── accessibility/
├── components/
│   └── [name]/
├── blocks/
│   └── [name]/
├── templates/
│   └── [name]/
├── themes/
│   ├── [name]/
│   └── builder/
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
└── es/                             # Mirrored Spanish routes
```

`Preview / API / Examples / Accessibility` is styled as a tab list but implemented as separate static routes. Astro prefetching may improve transitions without making content dependent on client state.

---

## 7. Product catalogs

### 7.1 Primitives — 52 complete at GA

Every primitive requires, in both languages:

- Purpose, status, package, version, and installation
- Behavioral model and composition guidance
- Complete public API reference generated from source
- At least one production-quality live example and source view
- Authored accessibility contract
- Generated axe, keyboard, focus, semantics, and ARIA evidence
- Consumer responsibilities and unsupported assumptions
- CSS, Tailwind, and UnoCSS styling guidance where applicable
- SSR/hydration notes and test guidance
- Related primitives/components and migration notes

Missing authored content or generated evidence fails the documentation quality gate.

### 7.2 Components — 21 at GA

The launch set is:

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

Components are source-owned recipes installed by the CLI, not a second opaque package layer. Each needs complete states, recipe output parity, tests, documentation, accessibility evidence, and theme previews.

### 7.3 Blocks — 36 or more at GA

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

Each block includes full-page and embedded previews, responsive/mobile behavior, loading/empty/error/permission states, primitive and component dependency maps, files/routes added, data-boundary assumptions, accessibility evidence, and CLI installation.

### 7.4 Templates — 29 unique / 32 portfolio placements at GA

Launch both complete portfolios selected in Question 47.

#### Balanced Product portfolio — 16 placements

1. Authentication Starter
2. Onboarding App
3. SaaS Dashboard
4. Multi-tenant Admin
5. Settings Portal
6. Billing Portal
7. Resource Manager
8. Observability Console
9. AI Chat
10. AI Workflow
11. Search Application
12. Storefront
13. Marketplace
14. Content Studio
15. Marketing Site
16. Documentation/Product Site

#### Enterprise Platform/Governance portfolio — 16 placements

1. Multi-tenant Admin
2. Identity & Access
3. Audit Log
4. Billing Operations
5. Observability Console
6. Resource Manager
7. Incident Response
8. AI Operations
9. API Management
10. Developer Portal
11. Security Center
12. Compliance Center
13. Data Governance
14. Workflow Automation
15. Support Operations
16. Enterprise Settings

Multi-tenant Admin, Observability Console, and Resource Manager are shared canonical templates tagged into both portfolios. They are implemented and maintained once, resulting in **29 unique templates across 32 portfolio placements**. Create a second template only when the architecture, workflow, or deployment assumptions are materially different—not merely to satisfy both labels.

The combined catalog is intentionally mixed across SolidStart, TanStack Start Solid, and client-side Vite + Solid Router. Every unique template targets one stack and declares router, data fetching, authentication, authorization, styling output, theme, package manager, deployment target, included blocks, replaceable boundaries, and portfolio membership.

Install through:

```sh
solidiom create --template <name>
```

The CLI supports npm, pnpm, Yarn, and Bun; detects the invoking package manager; does not write a foreign lockfile; and smoke-tests every template/package-manager combination before GA.

### 7.5 Themes and builder

Ship Ocean, Forest, Slate, and Aurora as editable starting points. Theme data uses canonical semantic token JSON and generates:

- CSS custom properties
- Tailwind theme mapping
- UnoCSS preset/configuration

The builder includes token editing, validation, light/dark previews across representative components, reset, import/export, and shareable versioned URL state. It does not claim to generate a complete design system.

### 7.6 Playground

Launch scope:

- Curated, repository-owned examples only
- TSX and CSS editing with output preview
- Reset, copy, and open actions
- Worker-based compilation and sandboxed iframe execution
- Sanitized categorical errors; never transmit source code to analytics
- Static fallback explaining browser requirements

Deferred: arbitrary npm dependencies, package installation, accounts, server persistence, downloadable projects, and remote code execution.

---

## 8. Brand and website implementation

### 8.1 Token work

1. Update `docs/solidiom/README.md` so the written palette exactly matches the board.
2. Define semantic aliases in `apps/site/src/assets/tokens.css`; do not expose raw palette names as the only API.
3. Validate contrast pairings in both modes before components depend on them.
4. Preserve the 4px spacing system, 8/12/16/20px radii, border-first layering, and restrained shadows.
5. Create vector logo/wordmark assets, light/dark/monochrome variants, favicon, and social-card compositions from the canonical board; do not ship cropped raster artwork as UI assets.

### 8.2 Responsive interpretation

The board establishes visual hierarchy and character, not fixed geometry. Implement:

- Responsive hero composition with equivalent hierarchy rather than scaled desktop artwork
- Reflowing cards and directories for bilingual text expansion
- Mobile navigation and search using Solidiom primitives
- Reduced-motion behavior for all decorative/reactive effects
- 200% and 400% zoom resilience
- Logical-property layouts suitable for future locale expansion

### 8.3 Ecosystem proof

Replace “Trusted by” unless endorsements are documented. Use compatibility wording and show only projects covered by tested integration evidence. Remove Discord and inactive social links; point community actions to GitHub Discussions, Issues, Contributing, and Code of Conduct.

---

## 9. Search, analytics, newsletter, and privacy

### 9.1 Search

Pagefind indexes guides, primitives, components, API symbols, examples, accessibility contracts, blocks, templates, themes, blog, changelog, and migrations. Results include content-type and language tags. The ⌘K/Ctrl+K dialog supports keyboard navigation, result grouping, and no-JavaScript links.

### 9.2 Analytics

Use PostHog Cloud with autocapture and session replay disabled. Events are an allowlist, for example:

- Search opened / result selected (never the query)
- Installation command copied
- Example run
- Playground error category (never source or error text containing source)
- Theme exported
- CLI or GitHub outbound action

Never collect raw queries, playground code, theme values, email addresses, free-form form text, or persistent cross-site identifiers. Document the exact event schema in the privacy policy and enforce it through a typed analytics adapter.

### 9.3 Newsletter

Submit the static footer form to Buttondown. Require explicit consent and double opt-in. Provide confirmation, failure, privacy, and unsubscribe behavior. The email field must never flow through PostHog.

---

## 10. Quality gates

### 10.1 Accessibility

GA target: WCAG 2.2 AA plus applicable WAI-ARIA Authoring Practices.

Every primitive combines authored intent with generated evidence from the existing a11y toolchain (`vitest.a11y.config.ts`, `tools/run-a11y.ts`, `tools/axe-results.ts`, and related reports). Automated checks do not replace manual keyboard, focus, zoom, high-contrast, reduced-motion, screen-reader, and mobile/touch review.

### 10.2 Performance

Use route-class budgets enforced in CI:

| Route class              | Policy                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Marketing/docs           | Static by default; only essential islands; search loaded on demand.                    |
| Catalog/detail           | Preview hydration only when interactive; media and source deferred.                    |
| Playground/theme builder | Route-local bundles; editor/compiler loaded after intent; no impact on content routes. |

Set numeric budgets during the foundation milestone after measuring the validated POC and first vertical slice. Gate Core Web Vitals, JavaScript/CSS/image weight, hydration count, and route-level chunk leakage.

### 10.3 Required validation

- `astro check`, TypeScript, lint, and production build
- Registry route-count and schema checks
- TypeDoc normalization and public-export completeness
- Translation parity/freshness and bilingual link checks
- Pagefind index coverage and keyboard search tests
- Unit/browser tests for Solid islands
- WCAG/axe plus manual evidence matrix
- Playwright end-to-end tests at desktop, tablet, and mobile widths
- Visual regression in light/dark and English/Spanish
- Template smoke tests across npm, pnpm, Yarn, and Bun
- Signed-manifest/checksum verification and tamper failure tests
- Route-class performance and Lighthouse gates
- Link, canonical, `hreflang`, sitemap, structured-data, and redirect checks

---

## 11. Security and supply chain

- Publish `SECURITY.md` with supported versions and coordinated-disclosure process.
- Enable GitHub private vulnerability reporting; do not direct vulnerability reports to public Issues.
- Sign versioned registry indexes and verify every downloaded file against its hash.
- Pin generated dependency metadata and fail closed on missing/invalid signatures or hashes.
- Record source provenance for community submissions and generated catalog artifacts.
- Restrict playground iframe permissions and define a strict Content Security Policy.
- Do not permit arbitrary remote imports in the launch playground.
- Scan generated templates and copied source using the repository's dependency/security workflow.

---

## 12. Licensing and contribution policy

- MIT: primitives, components, blocks, templates, themes, CLI output, and website source.
- CC BY 4.0: prose and non-brand documentation media.
- Reserved: Solidiom name, logo, and distinctive brand assets under a published brand-use policy.
- Require DCO `Signed-off-by` for contributions.
- Require contributor provenance, catalog schema validation, tests, accessibility evidence, screenshots, translation review, and maintainer approval.
- Do not auto-publish community submissions.

This is an implementation policy, not legal advice; final license and trademark text should receive appropriate legal review before GA.

---

## 13. Migration and release milestones

### M0 — Governance and canonical brand inputs

- Update brand palette and typography specification.
- Add licensing split, brand-use policy draft, `SECURITY.md`, DCO instructions, analytics event policy, and content schemas.
- Register/configure `solidiom.org` and Cloudflare project when ownership is available.

**Exit:** no conflicting token, licensing, privacy, or product-layer definitions remain.

### M1 — Foundation and private alpha shell

- Create `apps/site` from the validated POC configuration.
- Implement tokens, fonts, light/dark bootstrapping, responsive shell, bilingual routing, metadata, and foundational SEO.
- Implement all shell interactions with Solidiom from day one.
- Add CI targets, Cloudflare preview deployment, route-class bundle reporting, and parity inventory for `apps/docs`.

**Exit:** production build and preview pass; no hydration errors; English/Spanish shell, theme selection, responsive navigation, and focus behavior work.

### M2 — Content platform vertical slice

- Extend registry product-layer metadata and integrity schema.
- Implement custom TypeDoc normalization/rendering.
- Implement authored + generated accessibility pipeline.
- Implement Pagefind search and static detail-route tabs.
- Complete representative vertical slices for Dialog, Combobox, and Data Table in both languages.

**Exit:** one complex entry proves package → registry → API → examples → accessibility → translation → search → static route end to end.

### M3 — Public beta platform

- Open a clearly labeled beta after substantial usable coverage exists.
- Deliver component recipe generation, CLI source-copy flow, initial blocks/templates, theme presets, playground beta, theme-builder beta, five articles, changelog, enterprise guidance, newsletter, and privacy-limited analytics.
- Continue publishing only content that passes its maturity gate.

**Exit:** beta is useful without implying GA completeness; every incomplete surface is labeled and no dead CTA exists.

### M4 — Catalog completion

- Complete 52 bilingual primitive references.
- Complete 21 components.
- Complete 36+ blocks across 12 categories.
- Complete both 16-item template portfolios: 29 unique templates and 32 portfolio placements across the selected stacks and four package managers.
- Complete all four themes and full builder.

**Exit:** registry counts, quality evidence, translations, and installation smoke tests satisfy the agreed launch scope.

### M5 — GA hardening and cutover

- Complete WCAG 2.2 AA/APG review, visual regression matrix, browser matrix, performance budgets, security/tamper tests, legal copy review, SEO checks, and production rollback procedure.
- Verify `apps/docs` parity inventory, archive POC findings, then remove `apps/docs` and `apps/docs-astro-poc`.
- Publish canonical redirects and deploy `solidiom.org`.

**Exit:** every GA criterion in §14 passes; no maturity labels or temporary exceptions remain.

---

## 14. GA acceptance criteria

GA requires all of the following:

- [ ] One canonical registry identity and explicit deliverables per product layer
- [ ] 52/52 primitives complete in English and Spanish
- [ ] 21/21 source-owned components complete
- [ ] At least 36 blocks, at least three in each category
- [ ] Balanced Product and Enterprise Platform/Governance portfolios are complete: 29/29 unique templates and 32/32 portfolio placements, all package-manager smoke-tested
- [ ] Ocean, Forest, Slate, and Aurora plus full theme builder complete
- [ ] Curated playground passes sandbox, browser, accessibility, and privacy tests
- [ ] Five foundational articles and changelog published in both languages
- [ ] Unified Pagefind search covers every required content type and locale
- [ ] WCAG 2.2 AA/APG evidence complete; no critical accessibility defects
- [ ] Route-class performance budgets and browser matrix pass
- [ ] Solidiom-only website dogfooding verified
- [ ] Signed registry manifests and fail-closed verification enabled
- [ ] PostHog allowlist, Buttondown consent, privacy, security, license, DCO, and brand policies published
- [ ] `solidiom.org` production/preview/redirect/rollback paths verified
- [ ] Legacy `apps/docs` and POC removed only after parity and baseline verification

---

## 15. Capacity-neutral effort model

These are planning ranges, not commitments. They include implementation, tests, documentation, review, and bilingual completion; they do not assume work can be perfectly parallelized.

| Workstream                                                                                    |   Estimated person-weeks |
| --------------------------------------------------------------------------------------------- | -----------------------: |
| Governance, brand assets, tokens, legal/privacy/security policy                               |                      3–5 |
| Astro foundation, shell, i18n, deployment, SEO, and migration tooling                         |                     7–11 |
| Registry schema, signed manifests, search, TypeDoc, and accessibility pipelines               |                    10–15 |
| 52 complete bilingual primitive references                                                    |                    16–24 |
| 21 source-owned components and three styling outputs                                          |                    15–23 |
| 36+ production blocks with required states                                                    |                    28–42 |
| 29 unique templates / 32 placements across two portfolios, mixed stacks, and package managers |                    58–87 |
| Curated playground                                                                            |                     6–10 |
| Four themes and full theme builder                                                            |                     9–14 |
| Marketing, five articles, enterprise guidance, newsletter, and analytics                      |                      6–9 |
| GA hardening, browser/a11y/performance/visual matrices, and cutover                           |                     8–12 |
| **Total**                                                                                     | **166–252 person-weeks** |

Illustrative calendar projections:

- **One primary engineer:** roughly 3.8–5.7 years at 44 productive project weeks/year, before external review delays.
- **Five-person cross-functional team:** roughly 11–17 months at about 70% parallel efficiency, assuming design, platform, catalog/content, templates/blocks, and QA/localization can progress concurrently.

The scope—not Astro—is the schedule driver. Blocks, templates, bilingual content, and quality evidence account for most of the effort. Do not compress the estimate by weakening the selected GA gates without an explicit decision change.

---

## 16. Principal risks

| Risk                                                 | Mitigation                                                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Launch scope is program-sized                        | Private alpha → public beta → GA gates; capacity-neutral estimates; preserve explicit counts.                                          |
| Solid 2 and framework churn                          | Central catalog versions, representative compatibility apps, pinned template assumptions, and upgrade gates.                           |
| Strict dogfooding creates circular blockers          | Order primitive/component work ahead of the website feature that consumes it; maintain a dependency board, not third-party exceptions. |
| API normalization misses complex Solid types         | Prove Dialog, Combobox, and Data Table first; version the normalized schema; snapshot output.                                          |
| Bilingual content drifts                             | Source hashes, translation status, fluent technical review, and release-blocking freshness checks.                                     |
| Generated CSS/Tailwind/UnoCSS diverge                | One recipe contract, parity snapshots, and documented adapter-specific exceptions only.                                                |
| Blocks/templates become superficial demos            | Enforce required states, data assumptions, dependency maps, accessibility evidence, and installation tests.                            |
| Portfolio overlap creates duplicate template forks   | Keep one canonical template for shared concepts; use portfolio tags and create variants only for materially different architectures.   |
| Interactive tools leak code or inflate static routes | Worker + sandboxed iframe, strict CSP, route-local chunks, typed analytics adapter, and bundle-leak gates.                             |
| Registry compromise affects copied source            | Signed manifests, checksums, provenance, pinned dependencies, and fail-closed CLI behavior.                                            |
| Brand board fails under real content                 | System-faithful responsive interpretation, bilingual stress tests, zoom/reduced-motion checks, and visual regression.                  |
| Two legacy apps linger                               | Treat deletion after parity as an M5 acceptance criterion, not optional cleanup.                                                       |

---

## 17. External operational references

- [Cloudflare Pages preview deployments](https://developer.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Buttondown static subscriber forms](https://docs.buttondown.com/building-your-subscriber-base)
- [Buttondown double opt-in](https://docs.buttondown.com/double-opt-in)
- [SolidStart overview](https://docs.solidjs.com/solid-start)
- [TanStack Solid 2 Router/Start/Query direction](https://tanstack.com/blog/tanstack-start-solid-v2)

External documentation has been summarized and rephrased. Verify provider and framework behavior again during implementation because external services and beta ecosystems can change.
