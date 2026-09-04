---
id: wcag-2.2-aa-audit
title: "WCAG 2.2 AA / APG Compliance Audit"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers, QA"
tags: [accessibility, wcag, apg, audit, qa]
lifecycle: active
date: 2026-08-07
---

# WCAG 2.2 AA / APG Compliance Audit

**Status:** Initial automated audit complete. Critical and serious issues: 0.
**Scope:** All 52 public primitives, 30 components, site routes (en + es).
**Standard:** WCAG 2.2 Level AA, WAI-ARIA Authoring Practices Guide (APG).

> **Coverage update (86-primitive scan):** The executable axe-core scan
> (`tests/a11y/primitives-axe-scan.browser.test.tsx`) now covers **all 86
> catalog primitives** and passes with 0 violations. The pass/keyboard/APG
> tables below remain scoped to the **52 GA (`stable`) primitives**, which are
> the accessibility **conformance promise** and carry per-primitive published
> evidence (`packages/*/docs/accessibility/evidence.json`). The **34 newer
> primitives are `experimental`**: they are now scanned and passing, but are
> intentionally not GA-gated and do not yet publish per-primitive evidence.
> In short — **86 scanned = 52 GA-conformant + 34 experimental (scanned, not
> yet GA-promised).**

## Methodology

| Criterion            | Tool / Method                           | Coverage                                |
| -------------------- | --------------------------------------- | --------------------------------------- |
| Automated violations | axe-core 4.10.2 via Vitest browser mode | 52/52 primitives                        |
| Keyboard navigation  | Manual audit per primitive              | 52/52 primitives                        |
| Focus management     | Automated + manual                      | All overlay/dialog/menu primitives      |
| Color contrast       | Theme preset audit (PRESET-005)         | 4 presets × light/dark                  |
| Screen reader        | VoiceOver macOS                         | Beta surface (documented in AT results) |
| Reduced motion       | `prefers-reduced-motion` media query    | All animated primitives                 |
| Target size          | 2.5.8 Target Size (Minimum)             | Interactive primitives                  |

## Automated Results Summary

- **axe-core scan:** 0 violations across 52 primitives (see `docs/axe-scan-results.md`)
- **Keyboard audit:** All primitives implement documented keyboard contracts (see `docs/keyboard-audit-results.md`)
- **Contrast ratios:** All 4 presets pass AA minimums in light and dark modes (see `pnpm run audit:preset-themes`)
- **AT verification:** VoiceOver records present for beta surface (see `docs/at-audit-results/`)

## WCAG 2.2 Principle Coverage

### 1. Perceivable

| SC                            | Level | Status | Notes                                              |
| ----------------------------- | ----- | ------ | -------------------------------------------------- |
| 1.1.1 Non-text Content        | A     | Pass   | All interactive controls have accessible names     |
| 1.3.1 Info and Relationships  | A     | Pass   | Semantic HTML + ARIA roles/properties              |
| 1.3.2 Meaningful Sequence     | A     | Pass   | DOM order matches visual order                     |
| 1.4.1 Use of Color            | A     | Pass   | States use data-attributes, not color alone        |
| 1.4.3 Contrast (Minimum)      | AA    | Pass   | All presets meet 4.5:1 text, 3:1 UI                |
| 1.4.4 Resize Text             | AA    | Pass   | rem-based typography scales                        |
| 1.4.11 Non-text Contrast      | AA    | Pass   | Focus indicators meet 3:1                          |
| 1.4.12 Text Spacing           | AA    | Pass   | No content loss at 1.5× line-height                |
| 1.4.13 Content on Hover/Focus | AA    | Pass   | Tooltip/popover dismissible, persistent, hoverable |

### 2. Operable

| SC                          | Level | Status | Notes                                               |
| --------------------------- | ----- | ------ | --------------------------------------------------- |
| 2.1.1 Keyboard              | A     | Pass   | All primitives keyboard-navigable                   |
| 2.1.2 No Keyboard Trap      | A     | Pass   | Focus trap only in modals, ESC dismisses            |
| 2.4.3 Focus Order           | A     | Pass   | Logical tab order, focus management in overlays     |
| 2.4.7 Focus Visible         | AA    | Pass   | Visible focus indicator on all interactive elements |
| 2.4.11 Focus Not Obscured   | AA    | Pass   | Focus targets not covered by sticky elements        |
| 2.5.8 Target Size (Minimum) | AA    | Pass   | Minimum 24×24px touch targets                       |

### 3. Understandable

| SC                           | Level | Status | Notes                             |
| ---------------------------- | ----- | ------ | --------------------------------- |
| 3.1.1 Language of Page       | A     | Pass   | `lang` attribute set per locale   |
| 3.1.2 Language of Parts      | AA    | Pass   | Code blocks excluded from locale  |
| 3.2.1 On Focus               | A     | Pass   | No context changes on focus       |
| 3.2.2 On Input               | A     | Pass   | No unexpected context changes     |
| 3.3.1 Error Identification   | A     | Pass   | Form errors described in text     |
| 3.3.2 Labels or Instructions | A     | Pass   | All inputs have associated labels |

### 4. Robust

| SC                      | Level | Status | Notes                                 |
| ----------------------- | ----- | ------ | ------------------------------------- |
| 4.1.2 Name, Role, Value | A     | Pass   | ARIA attributes match APG patterns    |
| 4.1.3 Status Messages   | AA    | Pass   | Live regions for toast/alert feedback |

## APG Pattern Compliance

All interactive primitives implement the corresponding WAI-ARIA APG pattern:

| Primitive | APG Pattern    | Keyboard                           | ARIA                                 | Status    |
| --------- | -------------- | ---------------------------------- | ------------------------------------ | --------- |
| accordion | Accordion      | Enter/Space toggle, Arrow navigate | `aria-expanded`, `aria-controls`     | Compliant |
| dialog    | Dialog (Modal) | ESC close, Tab trap                | `role="dialog"`, `aria-modal`        | Compliant |
| menu      | Menu/Menubar   | Arrow navigate, Enter select       | `role="menu"`, `role="menuitem"`     | Compliant |
| tabs      | Tabs           | Arrow switch, Tab into panel       | `role="tablist"`, `aria-selected`    | Compliant |
| combobox  | Combobox       | Arrow navigate, Enter select       | `role="combobox"`, `aria-expanded`   | Compliant |
| select    | Listbox        | Arrow navigate, Enter select       | `role="listbox"`, `aria-selected`    | Compliant |
| tooltip   | Tooltip        | ESC dismiss, hover/focus show      | `role="tooltip"`, `aria-describedby` | Compliant |
| switch    | Switch         | Space toggle                       | `role="switch"`, `aria-checked`      | Compliant |
| slider    | Slider         | Arrow adjust                       | `role="slider"`, `aria-valuenow`     | Compliant |
| tree      | Tree View      | Arrow navigate, Enter expand       | `role="tree"`, `aria-expanded`       | Compliant |

## Critical/Serious Issues

**None found.** 0 critical violations, 0 serious violations.

## Known Limitations (non-blocking)

- NVDA and JAWS testing is deferred to Phase 4 (external audit).
- TalkBack (Android) testing is deferred to Phase 4.
- Some `incomplete` axe results exist for dynamic content timing; these are informational, not violations.

## Evidence Locations

- `docs/axe-scan-results.md` — automated axe scan results
- `docs/keyboard-audit-results.md` — keyboard navigation audit
- `docs/at-audit-results/` — assistive technology verification records
- `artifacts/axe-results.json` — raw axe-core JSON output
- `packages/*/docs/accessibility/evidence.json` — per-primitive evidence
