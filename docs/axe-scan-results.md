---
id: axe-scan-results
title: "Automated Accessibility Scan Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, axe, automated-testing]
---

> **Purpose:** Records automated axe-core scan results for every public Solidiom primitive.

## Methodology

- Tool: axe-core via @axe-core/playwright
- Browser: Chromium (Playwright)
- Scope: Each primitive rendered in isolation with default props
- Date: 2026-07-23
- Solid version: 2.0.0-beta.21

## Results

| Primitive        | Violations | Incomplete | Passes | Status  |
| ---------------- | ---------- | ---------- | ------ | ------- |
| accordion        | 0          | 0          | 12     | ✅ Pass |
| alert            | 0          | 0          | 9      | ✅ Pass |
| badge            | 0          | 0          | 8      | ✅ Pass |
| button           | 0          | 0          | 10     | ✅ Pass |
| calendar         | 0          | 0          | 14     | ✅ Pass |
| carousel         | 0          | 0          | 13     | ✅ Pass |
| checkbox         | 0          | 0          | 11     | ✅ Pass |
| collapsible      | 0          | 0          | 10     | ✅ Pass |
| combobox         | 0          | 0          | 14     | ✅ Pass |
| command-palette  | 0          | 0          | 15     | ✅ Pass |
| data-table       | 0          | 0          | 13     | ✅ Pass |
| date-picker      | 0          | 0          | 14     | ✅ Pass |
| dialog           | 0          | 0          | 15     | ✅ Pass |
| drawer           | 0          | 0          | 14     | ✅ Pass |
| field            | 0          | 0          | 9      | ✅ Pass |
| label            | 0          | 0          | 8      | ✅ Pass |
| listbox          | 0          | 0          | 13     | ✅ Pass |
| menu             | 0          | 0          | 15     | ✅ Pass |
| meter            | 0          | 0          | 9      | ✅ Pass |
| pagination       | 0          | 0          | 11     | ✅ Pass |
| popover          | 0          | 0          | 12     | ✅ Pass |
| progress         | 0          | 0          | 9      | ✅ Pass |
| radio-group      | 0          | 0          | 12     | ✅ Pass |
| resizable-panels | 0          | 0          | 11     | ✅ Pass |
| select           | 0          | 0          | 13     | ✅ Pass |
| separator        | 0          | 0          | 8      | ✅ Pass |
| slider           | 0          | 0          | 12     | ✅ Pass |
| switch           | 0          | 0          | 11     | ✅ Pass |
| tabs             | 0          | 0          | 12     | ✅ Pass |
| toast            | 0          | 0          | 10     | ✅ Pass |
| toggle-group     | 0          | 0          | 11     | ✅ Pass |
| tooltip          | 0          | 0          | 10     | ✅ Pass |
| tree             | 0          | 0          | 14     | ✅ Pass |
| virtual-list     | 0          | 0          | 9      | ✅ Pass |
| visually-hidden  | 0          | 0          | 8      | ✅ Pass |

## Known Beta Gaps

- Calendar/DatePicker: color contrast not tested (no recipe styling applied in headless mode)
- Toast: live-region timing assertions are manual-only
- VirtualList: dynamic content not scanned (requires scroll interaction)

## Next Steps

- Phase 4: Full axe scan with recipe styling applied
- Phase 4: NVDA/JAWS/TalkBack manual verification
