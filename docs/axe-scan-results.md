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
- Executed: 2026-07-27T03:24:32.144Z
- Commit: `62ee410e8b1abbd23962b5f409e516d129665aa8`
- CI run: Local execution (not CI evidence)
- Test file: `tests/a11y/primitives-axe-scan.browser.test.tsx`
- Results artifact: `artifacts/axe-results.json`

## Results

| Primitive        | Violations | Incomplete | Passes | Status  |
| ---------------- | ---------- | ---------- | ------ | ------- |
| accordion        | 0          | 0          | 8      | ✅ Pass |
| alert            | 0          | 1          | 9      | ✅ Pass |
| badge            | 0          | 0          | 1      | ✅ Pass |
| button           | 0          | 0          | 3      | ✅ Pass |
| calendar         | 0          | 0          | 9      | ✅ Pass |
| carousel         | 0          | 0          | 13     | ✅ Pass |
| checkbox         | 0          | 0          | 12     | ✅ Pass |
| collapsible      | 0          | 0          | 8      | ✅ Pass |
| combobox         | 0          | 0          | 13     | ✅ Pass |
| command-palette  | 0          | 0          | 0      | ✅ Pass |
| data-table       | 0          | 0          | 5      | ✅ Pass |
| date-picker      | 0          | 0          | 0      | ✅ Pass |
| dialog           | 0          | 0          | 15     | ✅ Pass |
| drawer           | 0          | 1          | 14     | ✅ Pass |
| field            | 0          | 1          | 9      | ✅ Pass |
| input-otp        | 0          | 0          | 10     | ✅ Pass |
| label            | 0          | 0          | 1      | ✅ Pass |
| listbox          | 0          | 0          | 16     | ✅ Pass |
| menu             | 0          | 0          | 8      | ✅ Pass |
| meter            | 0          | 0          | 1      | ✅ Pass |
| navigation-menu  | 0          | 1          | 18     | ✅ Pass |
| pagination       | 0          | 0          | 6      | ✅ Pass |
| popover          | 0          | 0          | 8      | ✅ Pass |
| progress         | 0          | 0          | 11     | ✅ Pass |
| radio-group      | 0          | 0          | 13     | ✅ Pass |
| resizable-panels | 0          | 0          | 13     | ✅ Pass |
| scroll-area      | 0          | 0          | 2      | ✅ Pass |
| select           | 0          | 1          | 10     | ✅ Pass |
| separator        | 0          | 0          | 10     | ✅ Pass |
| slider           | 0          | 0          | 9      | ✅ Pass |
| switch           | 0          | 0          | 12     | ✅ Pass |
| tabs             | 0          | 0          | 16     | ✅ Pass |
| toast            | 0          | 0          | 10     | ✅ Pass |
| toggle           | 0          | 0          | 8      | ✅ Pass |
| toggle-group     | 0          | 0          | 12     | ✅ Pass |
| tooltip          | 0          | 0          | 1      | ✅ Pass |
| tree             | 0          | 0          | 14     | ✅ Pass |
| virtual-list     | 0          | 0          | 9      | ✅ Pass |
| visually-hidden  | 0          | 0          | 0      | ✅ Pass |

## Coverage

- Total primitives scanned: 39/39
- Violations found: 0
- Incomplete checks: 5
- Passing checks: 337
- All primitives passing: Yes ✅

## Known Beta Gaps

- Calendar/DatePicker: color contrast is not assessed without recipe styling in the isolated fixture.
- Toast: live-region timing assertions remain manual verification work.
- VirtualList: dynamic content is not scanned because it requires scroll interaction.

## Out of scope

NVDA, JAWS, TalkBack, and full styled accessibility certification are Phase 4 work. This report records only the Phase 1 automated axe baseline.
