# Cross-Browser Test Results

Generated: 2026-08-07
Last verified: 2026-08-07 (fresh E2E run across Chromium, Firefox, WebKit)

## Summary

All browser tests pass across Chromium, Firefox, and WebKit via Playwright provider.
The test surface covers all 52 registry primitives plus the RangeCalendar component,
plus 176 site-level E2E tests across all three desktop engines.

**Site E2E results (2026-08-07):** 176 passed across Chromium, Firefox, WebKit. 0 failures, 0 skips.

## Test Configuration

- **Browser config:** `vitest.browser.config.ts` — workspace-level browser test configuration with `@vitest/browser-playwright` factory running Chromium, Firefox, and WebKit.
- **Cross-browser config:** `tools/test/vitest.cross-browser.config.ts` — dedicated cross-browser matrix configuration for certification runs.

## Per-Primitive Test Surface Matrix

| Primitive        | Chromium | Firefox | WebKit | Notes |
| ---------------- | -------- | ------- | ------ | ----- |
| Accordion        | ✓        | ✓       | ✓      |       |
| Alert            | ✓        | ✓       | ✓      |       |
| Alert Dialog     | ✓        | ✓       | ✓      |       |
| Avatar           | ✓        | ✓       | ✓      |       |
| Badge            | ✓        | ✓       | ✓      |       |
| Breadcrumb       | ✓        | ✓       | ✓      |       |
| Button           | ✓        | ✓       | ✓      |       |
| Calendar         | ✓        | ✓       | ✓      |       |
| Card             | ✓        | ✓       | ✓      |       |
| Carousel         | ✓        | ✓       | ✓      |       |
| Checkbox         | ✓        | ✓       | ✓      |       |
| Collapsible      | ✓        | ✓       | ✓      |       |
| Combobox         | ✓        | ✓       | ✓      |       |
| Command Palette  | ✓        | ✓       | ✓      |       |
| Context Menu     | ✓        | ✓       | ✓      |       |
| Data Table       | ✓        | ✓       | ✓      |       |
| Date Picker      | ✓        | ✓       | ✓      |       |
| Dialog           | ✓        | ✓       | ✓      |       |
| Drawer           | ✓        | ✓       | ✓      |       |
| Empty State      | ✓        | ✓       | ✓      |       |
| Field            | ✓        | ✓       | ✓      |       |
| Hover Card       | ✓        | ✓       | ✓      |       |
| Input            | ✓        | ✓       | ✓      |       |
| Input OTP        | ✓        | ✓       | ✓      |       |
| Kbd              | ✓        | ✓       | ✓      |       |
| Label            | ✓        | ✓       | ✓      |       |
| Listbox          | ✓        | ✓       | ✓      |       |
| Menu             | ✓        | ✓       | ✓      |       |
| Meter            | ✓        | ✓       | ✓      |       |
| Navigation Menu  | ✓        | ✓       | ✓      |       |
| Pagination       | ✓        | ✓       | ✓      |       |
| Popover          | ✓        | ✓       | ✓      |       |
| Progress         | ✓        | ✓       | ✓      |       |
| Radio Group      | ✓        | ✓       | ✓      |       |
| Resizable Panels | ✓        | ✓       | ✓      |       |
| Scroll Area      | ✓        | ✓       | ✓      |       |
| Select           | ✓        | ✓       | ✓      |       |
| Separator        | ✓        | ✓       | ✓      |       |
| Sheet            | ✓        | ✓       | ✓      |       |
| Skeleton         | ✓        | ✓       | ✓      |       |
| Slider           | ✓        | ✓       | ✓      |       |
| Spinner          | ✓        | ✓       | ✓      |       |
| Switch           | ✓        | ✓       | ✓      |       |
| Tabs             | ✓        | ✓       | ✓      |       |
| Toast            | ✓        | ✓       | ✓      |       |
| Toggle           | ✓        | ✓       | ✓      |       |
| Toggle Group     | ✓        | ✓       | ✓      |       |
| Toolbar          | ✓        | ✓       | ✓      |       |
| Tooltip          | ✓        | ✓       | ✓      |       |
| Tree             | ✓        | ✓       | ✓      |       |
| Virtual List     | ✓        | ✓       | ✓      |       |
| Visually Hidden  | ✓        | ✓       | ✓      |       |

## Component-Level Coverage

| Component | Package | Chromium | Firefox | WebKit | Notes |
| --------- | ------- | -------- | ------- | ------ |
| RangeCalendar | @solidiom/calendar | ✓ | ✓ | ✓ | Distinct component within calendar package |

## Skip Policy

Skips are only permitted with issue links. Any browser-specific skip must reference
a tracked issue (upstream Solid beta, Playwright, or browser engine) and include:

- The issue URL
- The affected browser(s)
- The expected resolution timeline or upstream fix version

No unexplained skips are accepted in the beta certification matrix.
