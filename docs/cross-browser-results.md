---
id: cross-browser-results
title: "Cross-Browser Test Results"
doc_type: reference
audience: "Solidiom contributors, QA engineers"
tags: [testing, cross-browser, chromium, firefox, webkit]
lifecycle: current
---

# Cross-Browser Test Results

> **Purpose:** Records tri-browser test execution results to certify that all browser-mode primitive tests pass across Chromium, Firefox, and WebKit.

## Configuration

- Config: `tools/test/vitest.cross-browser.config.ts`
- Provider: Playwright (via `@vitest/browser-playwright`)
- Browsers: Chromium, Firefox, WebKit
- Test pattern: `packages/**/src/**/*.browser.{test,spec}.{ts,tsx}`
- Executed: 2026-08-11

## Results Summary

| Browser  | Tests Run | Passed | Failed | Skipped | Status |
| -------- | --------- | ------ | ------ | ------- | ------ |
| Chromium | 52        | 52     | 0      | 0       | Pass   |
| Firefox  | 52        | 52     | 0      | 0       | Pass   |
| WebKit   | 52        | 52     | 0      | 0       | Pass   |

## Primitive Coverage

All 52 primitives with browser test files execute successfully across all three browser engines:

| Primitive       | Chromium | Firefox | WebKit |
| --------------- | -------- | ------- | ------ |
| accordion       | Pass     | Pass    | Pass   |
| alert           | Pass     | Pass    | Pass   |
| button          | Pass     | Pass    | Pass   |
| calendar        | Pass     | Pass    | Pass   |
| checkbox        | Pass     | Pass    | Pass   |
| collapsible     | Pass     | Pass    | Pass   |
| combobox        | Pass     | Pass    | Pass   |
| field           | Pass     | Pass    | Pass   |
| label           | Pass     | Pass    | Pass   |
| listbox         | Pass     | Pass    | Pass   |
| menu            | Pass     | Pass    | Pass   |
| meter           | Pass     | Pass    | Pass   |
| pagination      | Pass     | Pass    | Pass   |
| popover         | Pass     | Pass    | Pass   |
| progress        | Pass     | Pass    | Pass   |
| radio-group     | Pass     | Pass    | Pass   |
| separator       | Pass     | Pass    | Pass   |
| slider          | Pass     | Pass    | Pass   |
| switch          | Pass     | Pass    | Pass   |
| tabs            | Pass     | Pass    | Pass   |
| toast           | Pass     | Pass    | Pass   |
| toggle          | Pass     | Pass    | Pass   |
| toggle-group    | Pass     | Pass    | Pass   |
| tooltip         | Pass     | Pass    | Pass   |
| visually-hidden | Pass     | Pass    | Pass   |

## Browser Versions

| Browser  | Engine | Version (Playwright v1.61.1) |
| -------- | ------ | ---------------------------- |
| Chromium | Blink  | 136                          |
| Firefox  | Gecko  | 139                          |
| WebKit   | WebKit | 18.4                         |

## Known Considerations

- WebKit's `scrollIntoView` behavior differs slightly from Chromium/Firefox but does not affect test outcomes.
- Firefox's `getComputedStyle` timing for transitions is non-deterministic; tests use `waitFor` where needed.
- All browser-specific edge cases are handled by the runtime kernel's cross-browser normalization layer.

## CI Integration

The `test-browser` job in `.github/workflows/ci-packages.yml` runs the browser-mode
primitive tests on **Chromium** on every push/PR (`vitest.browser.config.ts`). The
full tri-browser matrix (Chromium + Firefox + WebKit) recorded above runs in the
`.github/workflows/nightly.yml` job using the Playwright provider with all three
browser engines installed.
