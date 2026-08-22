---
id: beta-accessibility-evidence
title: "Beta Accessibility Evidence Index"
doc_type: evidence
tags: [accessibility, beta, evidence, C8]
lifecycle: current
---

> This evidence index is a historical Beta 1 snapshot. It documents the 52-primitive/30-component release surface at that time; it is not a current catalog inventory. Use `registry/index.json` and the current package metadata for present-day counts.

## Scope

This index covers the complete Solidiom beta surface:

- **52 primitives** across all categories (overlay, selection, navigation, collection, input, status, layout, and utility)
- **30 components** as styled recipe wrappers delegating accessibility to their underlying primitives

Evidence is organized by verification dimension. All 52 primitives pass automated axe-core scanning with 0 violations. Keyboard and Focus evidence is complete for all interactive primitives. Additional manual verification dimensions are tracked as Phase 4 work.

## Primitives Evidence Matrix

| Primitive        | Axe Evidence    | Keyboard | VoiceOver                 | Manual Evidence                                                                            |
| ---------------- | --------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| accordion        | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| alert            | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| alert-dialog     | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| avatar           | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| badge            | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| breadcrumb       | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| button           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| calendar         | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| card             | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| carousel         | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| checkbox         | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| collapsible      | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| combobox         | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| command-palette  | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| context-menu     | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| data-table       | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| date-picker      | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| dialog           | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅, Zoom ✅, Contrast ⚠️, Reduced motion ✅, Screen readers ✅ VO, Touch ✅ |
| drawer           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| empty-state      | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| field            | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| hover-card       | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| input            | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| input-otp        | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| kbd              | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| label            | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| listbox          | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| menu             | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| meter            | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| navigation-menu  | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| pagination       | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| popover          | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| progress         | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| radio-group      | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| resizable-panels | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| scroll-area      | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| select           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| separator        | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| sheet            | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| skeleton         | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| slider           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| spinner          | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |
| switch           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| tabs             | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| toast            | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| toggle           | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| toggle-group     | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| toolbar          | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| tooltip          | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Focus ✅                                                                                   |
| tree             | ✅ 0 violations | ✅ Pass  | ✅ Tested (novel pattern) | Keyboard/Focus ✅                                                                          |
| virtual-list     | ✅ 0 violations | ✅ Pass  | ✅ Standard ARIA          | Keyboard/Focus ✅                                                                          |
| visually-hidden  | ✅ 0 violations | N/A      | ✅ Standard ARIA          | N/A                                                                                        |

**VoiceOver testing details:** 9 primitives with novel ARIA patterns received dedicated VoiceOver verification: alert-dialog, combobox, command-palette, context-menu, data-table, dialog, menu, radio-group, tree. All remaining primitives use standard semantic ARIA attributes (aria-expanded, aria-checked, aria-selected, aria-disabled) that are correctly interpreted by assistive technology without custom testing.

## Components Evidence Matrix

Each component is a styled recipe wrapper that delegates accessibility to its underlying primitive. Per §8.2.1 item 9, all components cite their primitive's accessibility contract.

| Component        | Wrapped Primitive(s) | Accessibility Citation                                                                   |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| Accordion        | accordion            | Delegates to `@solidiom/accordion` primitive contract                                    |
| Alert            | alert                | Delegates to `@solidiom/alert` primitive contract                                        |
| Avatar           | avatar               | Delegates to `@solidiom/avatar` primitive contract                                       |
| Badge            | badge                | Delegates to `@solidiom/badge` primitive contract                                        |
| Breadcrumb       | breadcrumb           | Delegates to `@solidiom/breadcrumb` primitive contract                                   |
| Button           | button               | Delegates to `@solidiom/button` primitive contract                                       |
| Card             | card                 | Delegates to `@solidiom/card` primitive contract                                         |
| Checkbox         | checkbox             | Delegates to `@solidiom/checkbox` primitive contract                                     |
| Combobox         | combobox             | Delegates to `@solidiom/combobox` primitive contract                                     |
| Command Palette  | command-palette      | Delegates to `@solidiom/command-palette` primitive contract                              |
| Data Table       | data-table           | Delegates to `@solidiom/data-table` primitive contract                                   |
| Dialog           | dialog               | Delegates to `@solidiom/dialog` primitive contract                                       |
| Dropdown Menu    | menu                 | Delegates to `@solidiom/menu` primitive contract                                         |
| Field            | field, label, input  | Delegates to `@solidiom/field`, `@solidiom/label`, `@solidiom/input` primitive contracts |
| Input            | input                | Delegates to `@solidiom/input` primitive contract                                        |
| Kbd              | kbd                  | Delegates to `@solidiom/kbd` primitive contract                                          |
| Meter            | meter                | Delegates to `@solidiom/meter` primitive contract                                        |
| Navigation Menu  | navigation-menu      | Delegates to `@solidiom/navigation-menu` primitive contract                              |
| Pagination       | pagination           | Delegates to `@solidiom/pagination` primitive contract                                   |
| Popover          | popover              | Delegates to `@solidiom/popover` primitive contract                                      |
| Progress         | progress             | Delegates to `@solidiom/progress` primitive contract                                     |
| Radio Group      | radio-group          | Delegates to `@solidiom/radio-group` primitive contract                                  |
| Resizable Panels | resizable-panels     | Delegates to `@solidiom/resizable-panels` primitive contract                             |
| Scroll Area      | scroll-area          | Delegates to `@solidiom/scroll-area` primitive contract                                  |
| Select           | select               | Delegates to `@solidiom/select` primitive contract                                       |
| Sheet            | sheet                | Delegates to `@solidiom/sheet` primitive contract                                        |
| Spinner          | spinner              | Delegates to `@solidiom/spinner` primitive contract                                      |
| Switch           | switch               | Delegates to `@solidiom/switch` primitive contract                                       |
| Tabs             | tabs                 | Delegates to `@solidiom/tabs` primitive contract                                         |
| Toast            | toast                | Delegates to `@solidiom/toast` primitive contract                                        |
| Toolbar          | toolbar              | Delegates to `@solidiom/toolbar` primitive contract                                      |

## Evidence Sources

### Automated

- **Axe-core scans**: `artifacts/axe-results.json` — full scan results for all 52 primitives, 0 violations
- **Axe per-primitive**: `packages/<name>/docs/accessibility/evidence.json` — individual evidence per primitive
- **Axe aggregate index**: `artifacts/a11y-evidence.json` — indexed evidence IDs per primitive

### Manual

- **Keyboard audit**: `docs/evidence/keyboard-audit-results.md` — keyboard navigation audit for all 52 primitives (updated 2026-08-07)
- **Manual evidence matrix**: `docs/evidence/manual-evidence-matrix.md` — seven-dimension manual verification matrix
- **AT audit results**: `docs/at-audit-results/` — per-primitive VoiceOver verification records
- **AT audit index**: `docs/at-audit-results/index.md` — summary of VoiceOver testing coverage

### Per-primitive contracts

- **Accessibility contracts**: `packages/<name>/docs/accessibility/contract.md` — authored contract per primitive
- **Component documentation**: `apps/site/src/content/en/components/<name>.md` — 30 component docs citing primitive contracts

## Beta Gaps (Phase 4)

The following manual verification dimensions are deferred to Phase 4 for all primitives except Dialog (which completed a full G2 vertical-slice pass):

| Dimension                         | Status  | Notes                                                                                                           |
| --------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| Zoom (400%)                       | Phase 4 | Content reflow verification at 400% zoom, 1280px viewport                                                       |
| Contrast (WCAG 1.4.3/1.4.11)      | Phase 4 | Verified against default recipe output only; consuming product themes are consumer responsibility               |
| Reduced motion                    | Phase 4 | Verification of `prefers-reduced-motion: reduce` respect                                                        |
| Screen readers (beyond VoiceOver) | Phase 4 | NVDA, JAWS, TalkBack testing deferred. VoiceOver baseline established for 9 primitives with novel ARIA patterns |
| Touch targets                     | Phase 4 | 24×24 CSS px minimum verification on real touch hardware                                                        |

Dialog is the sole exception with completed evidence across all seven dimensions (see `docs/evidence/manual-evidence-matrix.md` for detail).

## Status

- ✅ **Automated axe**: All 52 primitives, 0 violations
- ✅ **Keyboard + Focus**: All interactive primitives audited and passing
- ✅ **VoiceOver (novel patterns)**: 9 primitives with custom ARIA patterns verified
- ✅ **VoiceOver (standard ARIA)**: All remaining primitives use standard semantic attributes with no custom patterns
- ⏳ **Phase 4 dimensions**: Zoom, Contrast, Reduced motion, Screen readers (NVDA/JAWS/TalkBack), Touch
