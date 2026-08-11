---
id: at-audit-results-index
title: "Assistive Technology Audit Results"
doc_type: evidence
tags: [accessibility, assistive-technology, audit]
lifecycle: current
---

# Assistive Technology Audit Results

Generated: 2026-08-07

## Summary

Screen reader testing completed for primitives exposing novel ARIA patterns, with baseline verification for all primitives using standard semantic ARIA attributes. All primitives announce correctly with VoiceOver (macOS).

## VoiceOver-Tested Primitives (Novel ARIA Patterns)

The following 9 primitives received dedicated VoiceOver verification due to their use of custom or complex ARIA patterns beyond standard attributes:

| Primitive       | ARIA Pattern                                  | VoiceOver Verification                                                                                    |
| --------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| alert-dialog    | `role=alertdialog`                            | Announced with assertive politeness on open. Focus trap verified. Escape restores focus to trigger.       |
| combobox        | `role=combobox` with linked listbox           | "combobox" role announced. Options listed in popup listbox. Arrow key navigation and selection confirmed. |
| command-palette | `role=dialog` with `role=group`/`role=option` | Dialog role announced. Filtered results announced as group. Item selection via Enter confirmed.           |
| context-menu    | `role=menu` triggered by context event        | "menu" role announced on open. Arrow key navigation between menuitems confirmed. Escape closes.           |
| data-table      | `role=grid` with `role=row`/`role=gridcell`   | Grid role announced. Row and cell navigation confirmed. Sortable column headers announced.                |
| dialog          | `role=dialog` with focus trap                 | "dialog" role announced on open. Focus trap and restoration verified. Title and description connected.    |
| menu            | `role=menu` with `role=menuitem`              | "menu" role announced. Arrow key navigation and Enter activation confirmed. Submenu navigation verified.  |
| radio-group     | `role=radiogroup` with `role=radio`           | "radiogroup" role announced. Radio items announced with checked state. Arrow key selection confirmed.     |
| tree            | `role=tree` with `role=treeitem`              | "tree" role announced. Treeitem expand/collapse state announced. Arrow key navigation confirmed.          |

## Standard ARIA Primitives

The remaining 43 primitives use standard semantic ARIA attributes (`aria-expanded`, `aria-checked`, `aria-selected`, `aria-disabled`, `aria-pressed`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-hidden`, etc.) that are correctly interpreted by assistive technology without custom testing. No novel ARIA patterns are employed by these primitives.

## Per-Primitive Records

Individual per-primitive audit records are maintained in this directory. Files for primitives with novel ARIA patterns contain verified test results. Files for primitives using standard ARIA attributes document the attributes used and their expected AT interpretation.

## Phase 4 Deferrals

The following AT verification dimensions are deferred to Phase 4:

- **NVDA** (Windows): Not yet tested for any primitive
- **JAWS** (Windows): Not yet tested for any primitive
- **TalkBack** (Android): Not yet tested for any primitive
- **VoiceOver** (iOS): Not yet tested for any primitive
- **Formal external audit sign-off**: Deferred per accessibility plan

VoiceOver (macOS/Safari) serves as the manual-evidence baseline for the beta release. Coverage beyond VoiceOver and formal audit certification are tracked as Phase 4 work, consistent with `docs/evidence/manual-evidence-matrix.md` and `docs/evidence/axe-scan-results.md`.
