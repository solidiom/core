---
id: documentation-toc
title: "Solidiom Documentation — Table of Contents"
doc_type: index
audience: "Solidiom contributors and maintainers"
tags: [documentation, navigation, toc]
lifecycle: current
authority: documentation table of contents
volatility: medium
---

# Solidiom Documentation — Table of Contents

Complete map of everything under `docs/`. For navigation conventions, the
lifecycle model, and plan authority, see [`README.md`](README.md).

> Generated from the current contents of `docs/`. When you add, move, or remove
> a document, update this file and re-run link checks.

## Read first

- [`plans/README.md`](plans/README.md) — Plans Dashboard: current milestone position, immediate priorities, and which document owns each kind of fact.
- [`plans/consolidated-plan.md`](plans/consolidated-plan.md) — Consolidated Execution Plan: single source of truth for task state, sequencing, Definitions of Done, defects, counters, and milestone exit criteria.
- [`architecture/website.md`](architecture/website.md) — Website architecture.
- [`architecture/design.md`](architecture/design.md) — Core library architecture.

## Top level

- [`README.md`](README.md) — Documentation index: navigation, directory structure, plan authority, lifecycle model, and authoring conventions.
- [`RELEASING.md`](RELEASING.md) — The two-step release model (Version PR → tag → publish) so a publish run never mutates the repo.
- [`bumping-version.md`](bumping-version.md) — Reference for the underlying version-bump mechanics and the rare manual bump; defers to `RELEASING.md` for normal releases.
- [`axe-scan-results.md`](axe-scan-results.md) — Automated accessibility scan results (axe-core via Vitest browser mode) per primitive.
- [`keyboard-audit-results.md`](keyboard-audit-results.md) — Keyboard navigation / activation / focus verification for all interactive primitives against APG 1.2.
- [`cross-browser-results.md`](cross-browser-results.md) — Tri-browser (Chromium/Firefox/WebKit) browser-mode primitive test results.

## Architecture — `architecture/`

Stable system design and accepted decisions.

- [`architecture/website.md`](architecture/website.md) — Solidiom Website Architecture: the durable authority for the scope and technical shape of the registry-driven, bilingual static Astro site with isolated Solid islands.
- [`architecture/design.md`](architecture/design.md) — openCenter Solidiom Design (Combined Documentation): the canonical design doc for the Solid 2-native runtime, primitive/adapter/recipe taxonomy, hybrid package-and-source distribution, styling boundaries, accessibility, and delivery policy. Major sections below.
- [`architecture/exit-animations.md`](architecture/exit-animations.md) — Exit Animations via `createPresence`: keeping overlay/disclosure elements mounted during exit animations using `createPresence` + `data-state` before DOM removal.
- [`architecture/solid2-migration-notes.md`](architecture/solid2-migration-notes.md) — Solid 2 Beta Migration Notes: reference log of Solid 2 beta API differences, pitfalls, and workarounds found while building the runtime kernel.

### Decisions (ADRs) — `architecture/decisions/`

- [`architecture/decisions/catalog-decisions.md`](architecture/decisions/catalog-decisions.md) — Catalog Decisions D1–D6: durable rationale (component = recipe wrapper, namespaced Registry v3 manifests, layer-aware site content, structured block states, derived class prefixes, etc.).
- [`architecture/decisions/typeset.md`](architecture/decisions/typeset.md) — Typeset and Prose Are Recipe Utility Scopes: establishes `typeset` and `prose` as canonical zero-runtime recipe utility scopes, not primitives or catalog components.

### `design.md` — major sections

`design.md` uses non-sequential section numbering, so these link to the
document itself; use in-file search for the section heading.

- 0. v0.6 architectural hardening decisions
- 1. Executive summary
- 2. Problem statement
- 3. Context and reference model
- 4. Goals and non-goals
- 5. System architecture
- 6. Source taxonomy
- 7. Behavioral families, not shadcn mirroring
- 8. Solid 2-native runtime rules
- 9. Runtime kernel
- 10. Primitive public contract
- 11. First-party primitive layer
- 12. Adapter architecture
- 13. Hybrid package and source distribution system
- 14. Styling, semantic attributes, recipes, and UnoCSS
- 15. shadcn/ui relationship
- 16. Accessibility and conformance
- 17. Runtime-first performance model and future static tooling
- 18. Repository and package structure
- 19. Versioning, deprecation, and compatibility policy
- 20. Migration and legacy support
- 21. Delivery phases
- 22. Risks and mitigations
- 23. Acceptance criteria
- 24. Rejected alternatives
- 25. Final recommendation
- 26. Reference basis
- 27. Implementation-time decisions

## Contracts — `contracts/`

Binding schemas, rules, and policies.

- [`contracts/public-package-classification.md`](contracts/public-package-classification.md) — Public-package classification: invariant that no publishable package sits outside the public catalog or an explicit non-public set.
- [`contracts/theme-contract.md`](contracts/theme-contract.md) — Canonical Theme Contract: theme definition schema, token-value model, validation rules, migration mechanism, generated output, and light/dark requirements.
- [`contracts/recipe-contract.md`](contracts/recipe-contract.md) — Canonical Recipe Contract: recipe definition schema, semantic vocabulary, token model, exception model, and validation rules.
- [`contracts/recipe-authoring-guide.md`](contracts/recipe-authoring-guide.md) — Recipe Authoring Guide: how to author a canonical recipe definition and generate its CSS, Tailwind, and UnoCSS output.
- [`contracts/block-catalog-manifest.md`](contracts/block-catalog-manifest.md) — Block Catalog Manifest: names, outcomes, required states, component dependencies, and data boundaries for all 36 block slots. (Machine-readable companion: [`contracts/block-catalog-manifest.json`](contracts/block-catalog-manifest.json).)
- [`contracts/posthog-event-schema.md`](contracts/posthog-event-schema.md) — PostHog Event Schema — Privacy Allowlist: the governed analytics event allowlist (GOV-004).
- [`contracts/translation-policy.md`](contracts/translation-policy.md) — Website Translation Lifecycle Policy: the i18n/translation lifecycle for website content.
- [`contracts/beta-coverage-matrix.md`](contracts/beta-coverage-matrix.md) — Beta Coverage Matrix: what "beta" means — included, excluded, and the path to GA; source of truth for maturity labels.

Machine-readable manifests in this directory:
[`contracts/block-catalog-manifest.json`](contracts/block-catalog-manifest.json),
[`contracts/template-catalog-manifest.json`](contracts/template-catalog-manifest.json).

## Guides — `guides/`

Task-oriented contributor instructions.

- [`guides/adding-a-primitive.md`](guides/adding-a-primitive.md) — Adding a New Primitive: scaffold, implement, style, test, and register a headless primitive following existing conventions and the automated completion gate.
- [`guides/adding-an-integration.md`](guides/adding-an-integration.md) — Adding an Adapter or Integration Package: add a package bridging Solidiom primitives with an external library or framework (Astro, TanStack, Floating UI).
- [`guides/releasing.md`](guides/releasing.md) — Releasing Packages and the Website: how maintainers publish packages and deploy the docs site via GitHub Actions.
- [`guides/migration.md`](guides/migration.md) — Migration Guide (CUT-005): migrating to Solidiom for developers.
- [`guides/deployment.md`](guides/deployment.md) — Deployment and Infrastructure Specification: Cloudflare deployment and infrastructure (OPS-002/OPS-003).
- [`guides/offline-install.md`](guides/offline-install.md) — Enterprise Offline Installation: setting up Solidiom in an air-gapped environment via a private npm registry.
- [`guides/limitations.md`](guides/limitations.md) — Known Limitations (CUT-005): documented current limitations for developers.

## Operations — `operations/`

- [`operations/ci-pipeline.md`](operations/ci-pipeline.md) — CI Pipeline: architecture and local reproduction of the split-target (`ci-packages.yml` / `ci-site.yml`) fast/full-tier CI/release strategy.
- [`operations/production-checklist.md`](operations/production-checklist.md) — OPS-004 Production Operational Checklist.
- [`operations/deployment-rehearsal.md`](operations/deployment-rehearsal.md) — OPS-005 Production Deployment and Rollback Rehearsal.
- [`operations/rollback-procedure.md`](operations/rollback-procedure.md) — Rollback Procedure (Cloudflare, BETA-003).

## QA — `qa/`

- [`qa/wcag-2.2-aa-audit.md`](qa/wcag-2.2-aa-audit.md) — WCAG 2.2 AA / APG Compliance Audit: automated and manual accessibility results (0 critical/serious) across all primitives, components, and site routes.
- [`qa/browser-support-matrix.md`](qa/browser-support-matrix.md) — Supported Browser Matrix: tiered desktop/mobile support levels with minimum versions and test evidence.
- [`qa/performance-budgets.md`](qa/performance-budgets.md) — Performance and Bundle Budgets: Core Web Vitals thresholds and per-asset/per-package bundle-size limits.
- [`qa/seo-bilingual-audit.md`](qa/seo-bilingual-audit.md) — SEO, Bilingual, Links, and Structured Data Audit: en/es locale parity plus SEO metadata, canonical/hreflang links, and structured data across routes.

## Plans — `plans/`

Active status, priorities, and sequencing.

- [`plans/README.md`](plans/README.md) — Plans Dashboard: current milestone position, immediate priorities, and document ownership.
- [`plans/consolidated-plan.md`](plans/consolidated-plan.md) — Consolidated Execution Plan: single source of truth for task state, sequencing, DoD, defects, counters, and milestone exit criteria.
- [`plans/ga-plan.md`](plans/ga-plan.md) — GA & Post-GA Plan: remaining Phase 4/5 and M6 tasks for stable v1 and post-GA growth, most blocked on Solid 2 upstream GA.

## Evidence — `evidence/`

Generated or recorded verification evidence (not hand-edited).

- [`evidence/manual-evidence-matrix.md`](evidence/manual-evidence-matrix.md) — Manual Accessibility Evidence Matrix: the seven manual verification dimensions tooling cannot establish, and completed manual passes per primitive.
- [`evidence/beta-accessibility-evidence.md`](evidence/beta-accessibility-evidence.md) — Beta Accessibility Evidence Index: Beta 1 accessibility evidence across the 52-primitive / 30-component surface by dimension.
- [`evidence/axe-scan-results.md`](evidence/axe-scan-results.md) — Automated Accessibility Scan Results (axe-core) per primitive.
- [`evidence/keyboard-audit-results.md`](evidence/keyboard-audit-results.md) — Keyboard Navigation Audit Results for every public primitive.
- [`evidence/cross-browser-results.md`](evidence/cross-browser-results.md) — Cross-Browser Test Results (Chromium/Firefox/WebKit component + site E2E).
- [`evidence/cross-browser-certification.md`](evidence/cross-browser-certification.md) — Cross-Browser Beta Certification against specific browser versions (Vitest browser mode + Playwright).
- [`evidence/ssr-hydration-test-results.md`](evidence/ssr-hydration-test-results.md) — SSR / Hydration Test Results: all primitives render via `renderToString` and hydrate without divergence.
- [`evidence/visual-regression-results.md`](evidence/visual-regression-results.md) — Visual Regression Test Results: screenshot baselines for all CVA recipe variants, no regressions.
- [`evidence/compile-time-results.md`](evidence/compile-time-results.md) — Compile-Time Optimization Results: static variant extraction at build time and per-primitive gzipped bundle sizes.
- [`evidence/no-transform-build-results.md`](evidence/no-transform-build-results.md) — No-Transform Build Results: all primitives build via `tsup` without the vite-plugin-solid compiler transform.
- [`evidence/recipe-contract-audit.md`](evidence/recipe-contract-audit.md) — Recipe Contract Audit: all recipe CSS uses only semantic `[data-scope][data-part]` / `[data-state]` selectors.
- [`evidence/adapter-styling-audit.md`](evidence/adapter-styling-audit.md) — Adapter Styling Audit: none of the 7 adapter packages set class/style — all styling-free.
- [`evidence/dependency-audit.md`](evidence/dependency-audit.md) — Dependency Audit: all dependencies pinned via `pnpm-lock.yaml`, no floating production ranges.
- [`evidence/security-audit.md`](evidence/security-audit.md) — Security Audit: no secrets in source, no `innerHTML`, all dependencies lockfile-pinned.
- [`evidence/infrastructure-audit.md`](evidence/infrastructure-audit.md) — Infrastructure Audit: registry rate limiting, CDN caching, and edge serving policy.
- [`evidence/vocabulary-exceptions-resolution.md`](evidence/vocabulary-exceptions-resolution.md) — Vocabulary Exceptions (G5 Formal Acceptance): the nine `VOCABULARY_EXCEPTIONS` data-state/flag collisions accepted as GA-acceptable.

## Templates — `templates/`

Fill-in-the-blank records.

- [`templates/at-verification-template.md`](templates/at-verification-template.md) — Assistive Technology Verification Record template (VoiceOver/NVDA/JAWS/TalkBack) that the per-primitive AT records are generated from.

## Assistive-technology audit results — `at-audit-results/`

Per-primitive AT verification records (52 primitive records + the index).

- [`at-audit-results/index.md`](at-audit-results/index.md) — Assistive Technology Audit Results: summary, the 9 VoiceOver-tested novel-ARIA primitives, the standard-ARIA primitives, and Phase 4 deferrals (NVDA/JAWS/TalkBack/iOS VoiceOver, external audit sign-off).

Each of the 52 primitives has an individual `AT Verification Record: <Name>`
file in this directory (`accordion.md`, `alert.md`, `alert-dialog.md`, …,
`tree.md`, `virtual-list.md`, `visually-hidden.md`). See the
[index](at-audit-results/index.md) for per-primitive verification status.

## Release notes — `releases/`

- [`releases/ga-2026-08-07.md`](releases/ga-2026-08-07.md) — Solidiom GA Release Notes: full catalog, signed V3 registry, production CLI, cross-browser certification, and the live solidiom.org site.
- [`releases/0.4.0.md`](releases/0.4.0.md) — Release 0.4.0: coordinated workspace-wide minor bump moving all 102 packages to 0.4.0; Solid 2 window to rc.1; TanStack table adapter rewritten against v9.
- [`releases/beta-2026-08-01.md`](releases/beta-2026-08-01.md) — Solidiom Beta 1 (August 7, 2026): full catalog (52 primitives, 30 components, 36 blocks, templates, themes) at the M4 Definition of Done.

## History — `history/`

`history/` and its subfolders (`history/poc/`, `history/plans/`,
`history/legacy-docs/`) currently contain no documents.
