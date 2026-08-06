---
id: website-m0-m3-history
title: "Website M0–M3 Implementation History"
doc_type: history
audience: "Solidiom maintainers researching completed website work"
tags: [website, history, milestones, evidence]
lifecycle: archived
authority: non-authoritative historical evidence
volatility: low
---

# Website M0–M3 Implementation History

> **Non-authoritative.** This document preserves implementation evidence and incident context. Current status, Definitions of Done, defects, and counters are owned by [`docs/plans/website-tasks.md`](../../plans/website-tasks.md).

## Scope

This history covers the completed row-level work from website milestones M0–M3 and the CI/evidence incidents that affected confidence in those milestones. It does not make a current check green and must not be used instead of re-running the canonical commands.

## M0 — Governance and canonical inputs

The following task groups completed the governance and input baseline:

- `GOV-001..006`: licensing, vulnerability reporting, DCO, analytics/privacy boundaries, disclosures, and brand-use policy.
- `BRAND-001..004`: written brand direction, semantic tokens, pinned/self-hosted fonts, and brand assets.
- `MIG-001..002`: legacy route/demo inventory and read-only status for the legacy app.
- `BASE-001..002`: reproducible Astro proof-of-concept baseline and Solid-version migration constraints.
- `OPS-001..002`: domain/Cloudflare ownership and deployment responsibility model.

G0 closed with explicit policy owners, a reproducible baseline, a migration inventory, assigned operations prerequisites, and no production secret committed to the repository.

## M1 — Foundation and private alpha shell

Completed implementation groups:

- `SITE-001..014`: `apps/site`, Nx integration, static baseline, document shell, navigation, prose, theme, metadata, accessibility, import boundaries, performance reporting, and migration audit.
- `I18N-001..004`: unprefixed English, `/es/`, locale switching, canonical/`hreflang`, translation hashes, statuses, and glossary policy.
- `TEST-001..004`: site tests, cross-browser shell coverage, visual harness, and advisory Lighthouse/bundle reporting.
- `CI-002..004`: site jobs, visual/performance jobs, and Solid matrix treatment.
- `OPS-003`: Cloudflare preview pipeline and deployment behavior.

`CI-001` was implemented and later deliberately reverted when all workflows became `workflow_dispatch`-only. That current policy remains open in the active backlog and is not resolved by this history.

The local evidence recorded during this period included an independent site check, production build, Pagefind generation, cross-browser shell coverage, and preview validation. Visual evidence later required platform correction, summarized below.

## M2 — Content platform and vertical slice

Completed implementation groups:

- `REG-001..007`: registry schema/versioning, deterministic generation, metadata, integrity, verification, and route invariants.
- `CONTENT-001..005`: package/site content loading, schemas, validation, translation freshness, and canonical example extraction.
- `API-001..005`: normalized public API artifacts, static rendering, coverage enforcement, and bilingual explanatory UI.
- `A11Y-001..006`: generated evidence, authored contracts, renderers, freshness policy, manual matrix design, and bilingual terminology.
- `DOCS-001..006`: generated primitive routes, tabbed subroutes, navigation, filtering, registry metadata, and SEO.
- `SEARCH-001..005`: Pagefind separation, Solidiom search UI, typed indexing, accessibility, and privacy-safe analytics.
- `VS-001..004`: Dialog, Combobox, and Data Table end-to-end slices plus the aggregate vertical-slice gate.

A later correction, `VS-005`, replaced a raw-text regular expression over the backlog with delegation to the primitive catalog gate. The old check could count prose and task rows rather than repository evidence. The corrected gate derived status from registry and content sources.

## M3 — Public beta platform delivered, then regressed

Completed work included:

- `RECIPE-001..004` and `RECIPE-007`: canonical recipe contract, CSS/Tailwind/UnoCSS emitters, and typeset/prose contract coverage.
- `CLI-001..011`: canonical sources, product-layer planning/install, verification, conflict/rollback, four package managers, template materialization, offline fixtures, bilingual docs, and test coverage.
- `THEME-001..006`: semantic theme schema and three outputs, parity/contrast/round-trip validation, and paired type scale.
- `BUILDER-001..006`: route-local theme builder, editor, previews, import/export, share state, and tests.
- `BETA-001..003`: beta coverage, acceptance matrix, and publication/rollback information.
- `A11Y-007..008`: manual evidence artifacts and site-token contrast correction.
- `TEST-005..006`: reproducible visual baselines and stabilized site E2E coverage.

The historical acceptance evidence included `beta:acceptance:report` at 60/60, `beta:acceptance:e2e` at 111/111 across Chromium, Firefox, and WebKit, site E2E at 435/435 across desktop and mobile projects, and a green phase 3 gate at the historical commit. These are historical measurements, not current claims.

The later catalog expansion regressed `RECIPE-005`, `RECIPE-006`, the aggregate phase gate, and translation/tool evidence. Current values and repair ownership are intentionally kept only in `website-tasks.md`.

## CI configuration incident

For part of the M3 closure period, `.github/workflows/ci.yml` was invalid because the final `phase3-gate` step was mis-indented. GitHub loaded no jobs, so statements that work was “enforced by CI” were not evidence that it had executed.

`CI-005` repaired the workflow, verified that 22 declared jobs loaded, and an observed run (`30871761546`) completed green across 31 matrix-expanded jobs at commit `079512e`. The important limitation is temporal: a green ancestor does not verify later changes. Subsequent current-tree regressions therefore reopened the relevant active rows.

The durable lesson is that adding a job is not sufficient. Evidence requires a loadable workflow and an observed run for the commit being claimed.

## Workflow trigger reversal

On 2026-08-04, all five workflows were changed to manual dispatch only. Push and pull-request triggers were commented in `ci.yml` and `preview-deploy.yml`. The job definitions remained, but automatic enforcement and per-PR preview behavior stopped. The active decision is tracked by `CI-001` and `CI-008` in `website-tasks.md`.

## Visual baseline incident

The original 36/36 local visual mismatch was diagnosed as macOS-versus-Linux rendering variance rather than stale site content. `TEST-005` introduced a pinned Playwright container and a dispatchable visual-baseline workflow. Baselines were recaptured in the pinned Linux image and reproduced on CI; an attempted broad pixel tolerance was removed because it masked the platform mismatch.

This history supports why the container is canonical. It does not imply current catalog pages or future visual changes have passed.

## Accessibility and translation evidence corrections

`A11Y-008` raised the site secondary token to meet normal-text contrast and added site-token contrast auditing. Two nearby defects were corrected: a duplicate banner landmark in `BetaBanner.tsx` and an E2E assertion that had been weakened to accept two banners.

`A11Y-009` committed per-primitive evidence, rebuilt the registry, and corrected vacuous zero-pass records. `BUILD-001` then added generated-artifact staleness checks. Translation hashes for primitive and CLI content were repaired, but human review remained a later promotion requirement.

## Generated-artifact and signing lessons

Build and generation commands were found to modify tracked outputs. `BUILD-001` made substantive staleness visible and stabilized timestamps/provenance when content was unchanged. Registry index signing was removed from the build because secret-derived signing changed the deterministic committed index; re-homing and asymmetric verification remain active work under `REG-008`.

## Superseded evidence

The following are deliberately historical:

- green run `30871761546` at `079512e`;
- 60/60 static beta acceptance;
- 111/111 browser beta acceptance;
- 435/435 site E2E;
- 36/36 container visual baselines;
- historical phase 3 aggregate success.

Always use the current backlog banner and canonical verification commands before changing a task state.
