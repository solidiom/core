---
id: keyboard-audit-results
title: "Keyboard Navigation Audit Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, keyboard, navigation, audit]
lifecycle: current
---

# Keyboard Navigation Audit Results

> **Purpose:** Records keyboard interaction verification for all interactive primitives. Each primitive is tested in isolation to confirm that keyboard navigation, activation, and focus management conform to WAI-ARIA Authoring Practices.

## Methodology

- Standard: WAI-ARIA Authoring Practices Guide (APG 1.2)
- Browser: Chromium (Playwright) via Vitest browser mode
- Scope: All interactive primitives rendered in isolation
- Executed: 2026-08-11
- Test files: `packages/*/src/*.browser.test.{ts,tsx}`

## Results

| Primitive        | Tab | Arrow Keys | Enter/Space | Escape | Focus Trap | Status  |
| ---------------- | --- | ---------- | ----------- | ------ | ---------- | ------- |
| accordion        | Yes | Yes        | Yes         | N/A    | No         | Pass |
| alert            | N/A | N/A        | N/A         | N/A    | No         | Pass |
| alert-dialog     | Yes | N/A        | Yes         | Yes    | Yes        | Pass |
| avatar           | N/A | N/A        | N/A         | N/A    | No         | Pass |
| badge            | N/A | N/A        | N/A         | N/A    | No         | Pass |
| breadcrumb       | Yes | N/A        | Yes         | N/A    | No         | Pass |
| button           | Yes | N/A        | Yes         | N/A    | No         | Pass |
| calendar         | Yes | Yes        | Yes         | N/A    | No         | Pass |
| card             | N/A | N/A        | N/A         | N/A    | No         | Pass |
| carousel         | Yes | Yes        | N/A         | N/A    | No         | Pass |
| checkbox         | Yes | N/A        | Yes         | N/A    | No         | Pass |
| collapsible      | Yes | N/A        | Yes         | N/A    | No         | Pass |
| combobox         | Yes | Yes        | Yes         | Yes    | No         | Pass |
| command-palette  | Yes | Yes        | Yes         | Yes    | Yes        | Pass |
| context-menu     | Yes | Yes        | Yes         | Yes    | No         | Pass |
| data-table       | Yes | Yes        | Yes         | N/A    | No         | Pass |
| date-picker      | Yes | Yes        | Yes         | Yes    | No         | Pass |
| dialog           | Yes | N/A        | Yes         | Yes    | Yes        | Pass |
| drawer           | Yes | N/A        | Yes         | Yes    | Yes        | Pass |
| empty-state      | N/A | N/A        | N/A         | N/A    | No         | Pass |
| field            | Yes | N/A        | N/A         | N/A    | No         | Pass |
| hover-card       | Yes | N/A        | N/A         | Yes    | No         | Pass |
| input            | Yes | N/A        | N/A         | N/A    | No         | Pass |
| input-otp        | Yes | Yes        | N/A         | N/A    | No         | Pass |
| kbd              | N/A | N/A        | N/A         | N/A    | No         | Pass |
| label            | N/A | N/A        | N/A         | N/A    | No         | Pass |
| listbox          | Yes | Yes        | Yes         | N/A    | No         | Pass |
| menu             | Yes | Yes        | Yes         | Yes    | No         | Pass |
| meter            | N/A | N/A        | N/A         | N/A    | No         | Pass |
| navigation-menu  | Yes | Yes        | Yes         | Yes    | No         | Pass |
| pagination       | Yes | N/A        | Yes         | N/A    | No         | Pass |
| popover          | Yes | N/A        | Yes         | Yes    | No         | Pass |
| progress         | N/A | N/A        | N/A         | N/A    | No         | Pass |
| radio-group      | Yes | Yes        | Yes         | N/A    | No         | Pass |
| resizable-panels | Yes | Yes        | N/A         | N/A    | No         | Pass |
| scroll-area      | Yes | Yes        | N/A         | N/A    | No         | Pass |
| select           | Yes | Yes        | Yes         | Yes    | No         | Pass |
| separator        | N/A | N/A        | N/A         | N/A    | No         | Pass |
| sheet            | Yes | N/A        | Yes         | Yes    | Yes        | Pass |
| skeleton         | N/A | N/A        | N/A         | N/A    | No         | Pass |
| slider           | Yes | Yes        | N/A         | N/A    | No         | Pass |
| spinner          | N/A | N/A        | N/A         | N/A    | No         | Pass |
| switch           | Yes | N/A        | Yes         | N/A    | No         | Pass |
| tabs             | Yes | Yes        | Yes         | N/A    | No         | Pass |
| toast            | Yes | N/A        | Yes         | Yes    | No         | Pass |
| toggle           | Yes | N/A        | Yes         | N/A    | No         | Pass |
| toggle-group     | Yes | Yes        | Yes         | N/A    | No         | Pass |
| toolbar          | Yes | Yes        | Yes         | N/A    | No         | Pass |
| tooltip          | Yes | N/A        | N/A         | Yes    | No         | Pass |
| tree             | Yes | Yes        | Yes         | N/A    | No         | Pass |
| virtual-list     | Yes | Yes        | N/A         | N/A    | No         | Pass |
| visually-hidden  | N/A | N/A        | N/A         | N/A    | No         | Pass |

## Legend

- **Yes**: Keyboard interaction implemented and verified
- **N/A**: Not applicable for this primitive (non-interactive or not relevant)
- **No**: Not applicable (primitive does not trap focus)

## Coverage

- Total primitives audited: 52/52
- Interactive primitives with keyboard support: 40
- Non-interactive primitives (presentational): 12
- All interactive primitives passing: Yes

## Keyboard Patterns Verified

| Pattern               | Primitives                                                     |
| --------------------- | -------------------------------------------------------------- |
| Focus trap            | dialog, alert-dialog, drawer, sheet, command-palette           |
| Roving tabindex       | tabs, radio-group, toggle-group, toolbar, menu, listbox, tree  |
| Arrow key navigation  | slider, calendar, combobox, data-table, navigation-menu        |
| Typeahead             | select, combobox, listbox, menu                                |
| Escape to dismiss     | dialog, popover, tooltip, menu, combobox, drawer, sheet, toast |

## Known Beta Gaps

- Drag-and-drop keyboard alternatives for resizable-panels are basic (arrow keys only).
- VirtualList keyboard scrolling does not pre-load items beyond the visible viewport.
- Full screen reader interaction testing (NVDA, JAWS, VoiceOver, TalkBack) is Phase 4 work per A11Y-005.
