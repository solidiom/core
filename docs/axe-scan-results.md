---
id: axe-scan-results
title: "Automated Accessibility Scan Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, axe, automated-testing]
---

> **Purpose:** Records axe-core results emitted by the executable browser suite. This report is rejected when the underlying result artifact is incomplete, duplicated, malformed, or contains violations.

## Methodology

- Tool: axe-core 4.10.2 via Vitest browser mode
- Browser: chromium (Playwright)
- Scope: Each public primitive rendered in isolation with minimal valid props
- Executed: 2026-08-03T01:38:27.833Z
- Commit: `91502032e6d025dfca0ffa771cf4b95f53c2a58e`
- CI run: Local execution (not CI evidence)
- Test file: `tests/a11y/primitives-axe-scan.browser.test.tsx`
- Results artifact: `artifacts/axe-results.json`

## Results

| Primitive        | Evidence ID                   | Violations | Incomplete | Passes | Status  |
| ---------------- | ----------------------------- | ---------- | ---------- | ------ | ------- |
| accordion        | axe-accordion-scan-v1         | 0          | 0          | 8      | ✅ Pass |
| alert            | axe-alert-scan-v1             | 0          | 1          | 9      | ✅ Pass |
| alert-dialog     | axe-alert-dialog-scan-v1      | 0          | 0          | 16     | ✅ Pass |
| avatar           | axe-avatar-scan-v1            | 0          | 0          | 1      | ✅ Pass |
| badge            | axe-badge-scan-v1             | 0          | 0          | 1      | ✅ Pass |
| breadcrumb       | axe-breadcrumb-scan-v1        | 0          | 0          | 12     | ✅ Pass |
| button           | axe-button-scan-v1            | 0          | 0          | 3      | ✅ Pass |
| calendar         | axe-calendar-scan-v1          | 0          | 1          | 20     | ✅ Pass |
| card             | axe-card-scan-v1              | 0          | 0          | 3      | ✅ Pass |
| carousel         | axe-carousel-scan-v1          | 0          | 0          | 13     | ✅ Pass |
| checkbox         | axe-checkbox-scan-v1          | 0          | 0          | 12     | ✅ Pass |
| collapsible      | axe-collapsible-scan-v1       | 0          | 0          | 8      | ✅ Pass |
| combobox         | axe-combobox-scan-v1          | 0          | 0          | 13     | ✅ Pass |
| command-palette  | axe-command-palette-scan-v1   | 0          | 0          | 0      | ✅ Pass |
| context-menu     | axe-context-menu-scan-v1      | 0          | 0          | 1      | ✅ Pass |
| data-table       | axe-data-table-scan-v1        | 0          | 0          | 5      | ✅ Pass |
| date-picker      | axe-date-picker-scan-v1       | 0          | 0          | 0      | ✅ Pass |
| dialog           | axe-dialog-scan-v1            | 0          | 0          | 15     | ✅ Pass |
| drawer           | axe-drawer-scan-v1            | 0          | 1          | 14     | ✅ Pass |
| empty-state      | axe-empty-state-scan-v1       | 0          | 0          | 7      | ✅ Pass |
| field            | axe-field-scan-v1             | 0          | 1          | 9      | ✅ Pass |
| hover-card       | axe-hover-card-scan-v1        | 0          | 0          | 1      | ✅ Pass |
| input            | axe-input-scan-v1             | 0          | 0          | 5      | ✅ Pass |
| input-otp        | axe-input-otp-scan-v1         | 0          | 0          | 10     | ✅ Pass |
| kbd              | axe-kbd-scan-v1               | 0          | 0          | 1      | ✅ Pass |
| label            | axe-label-scan-v1             | 0          | 0          | 1      | ✅ Pass |
| listbox          | axe-listbox-scan-v1           | 0          | 0          | 16     | ✅ Pass |
| menu             | axe-menu-scan-v1              | 0          | 0          | 8      | ✅ Pass |
| meter            | axe-meter-scan-v1             | 0          | 0          | 1      | ✅ Pass |
| navigation-menu  | axe-navigation-menu-scan-v1   | 0          | 1          | 18     | ✅ Pass |
| pagination       | axe-pagination-scan-v1        | 0          | 0          | 6      | ✅ Pass |
| popover          | axe-popover-scan-v1           | 0          | 0          | 8      | ✅ Pass |
| progress         | axe-progress-scan-v1          | 0          | 0          | 11     | ✅ Pass |
| radio-group      | axe-radio-group-scan-v1       | 0          | 0          | 13     | ✅ Pass |
| resizable-panels | axe-resizable-panels-scan-v1  | 0          | 0          | 13     | ✅ Pass |
| scroll-area      | axe-scroll-area-scan-v1       | 0          | 0          | 2      | ✅ Pass |
| select           | axe-select-scan-v1            | 0          | 1          | 10     | ✅ Pass |
| separator        | axe-separator-scan-v1         | 0          | 0          | 10     | ✅ Pass |
| sheet            | axe-sheet-scan-v1             | 0          | 0          | 16     | ✅ Pass |
| skeleton         | axe-skeleton-scan-v1          | 0          | 0          | 1      | ✅ Pass |
| slider           | axe-slider-scan-v1            | 0          | 0          | 9      | ✅ Pass |
| spinner          | axe-spinner-scan-v1           | 0          | 0          | 9      | ✅ Pass |
| switch           | axe-switch-scan-v1            | 0          | 0          | 12     | ✅ Pass |
| tabs             | axe-tabs-scan-v1              | 0          | 0          | 16     | ✅ Pass |
| toast            | axe-toast-scan-v1             | 0          | 0          | 10     | ✅ Pass |
| toggle           | axe-toggle-scan-v1            | 0          | 0          | 8      | ✅ Pass |
| toggle-group     | axe-toggle-group-scan-v1      | 0          | 0          | 12     | ✅ Pass |
| toolbar          | axe-toolbar-scan-v1           | 0          | 0          | 12     | ✅ Pass |
| tooltip          | axe-tooltip-scan-v1           | 0          | 0          | 1      | ✅ Pass |
| tree             | axe-tree-scan-v1              | 0          | 0          | 14     | ✅ Pass |
| virtual-list     | axe-virtual-list-scan-v1      | 0          | 0          | 9      | ✅ Pass |
| visually-hidden  | axe-visually-hidden-scan-v1   | 0          | 0          | 0      | ✅ Pass |

## Coverage

- Total primitives scanned: 52/52
- Violations found: 0
- Incomplete checks: 6
- Passing checks: 433
- All primitives passing: Yes ✅

## Known Beta Gaps

- Calendar/DatePicker: color contrast is not assessed without recipe styling in the isolated fixture.
- Toast: live-region timing assertions remain manual verification work.
- VirtualList: dynamic content is not scanned because it requires scroll interaction.

## Out of scope

NVDA, JAWS, TalkBack, and full styled accessibility certification are Phase 4 work. This report records only the Phase 1 automated axe baseline.
