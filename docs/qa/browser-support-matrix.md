---
id: browser-support-matrix
title: "Supported Browser Matrix"
doc_type: reference
audience: "Solidiom contributors, QA, consumers"
tags: [browsers, compatibility, testing, qa]
lifecycle: active
date: 2026-08-07
---

# Supported Browser Matrix

**Status:** Desktop matrix verified via Vitest browser mode. Mobile verified via responsive viewport testing.

## Supported Browsers

### Desktop (Tier 1 — full support)

| Browser | Minimum Version | Engine | Test Evidence |
|---------|-----------------|--------|---------------|
| Chrome | 120+ | Blink | Vitest browser mode (Chromium) |
| Firefox | 121+ | Gecko | Vitest browser mode (Firefox) |
| Safari | 17.2+ | WebKit | Vitest browser mode (WebKit) |
| Edge | 120+ | Blink | Shares Chromium evidence |

### Mobile (Tier 1 — full support)

| Browser | Minimum Version | Platform | Test Evidence |
|---------|-----------------|----------|---------------|
| Safari iOS | 17.2+ | iOS 17+ | WebKit engine parity |
| Chrome Android | 120+ | Android 12+ | Blink engine parity |

### Desktop (Tier 2 — functional, not actively tested)

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Opera | 106+ | Blink engine, expected to work |
| Brave | 1.61+ | Blink engine, expected to work |
| Vivaldi | 6.5+ | Blink engine, expected to work |

### Not Supported

| Browser | Reason |
|---------|--------|
| Internet Explorer | End of life; no ES2020+ support |
| Safari < 17 | Missing CSS features (`:has()`, `@container`) |
| Chrome < 120 | Missing Popover API, missing CSS features |

## Feature Requirements

The following web platform features are required:

| Feature | Used by | Chrome | Firefox | Safari |
|---------|---------|--------|---------|--------|
| CSS `:has()` | Conditional styling | 105+ | 121+ | 15.4+ |
| CSS `@layer` | Recipe cascade isolation | 99+ | 97+ | 15.4+ |
| CSS Container Queries | Responsive blocks | 105+ | 110+ | 16+ |
| Popover API | Tooltip, Popover, Select | 114+ | 125+ | 17+ |
| Dialog element | Dialog, Sheet | 37+ | 98+ | 15.4+ |
| `inert` attribute | Focus trapping | 102+ | 112+ | 15.5+ |
| CSS `color-mix()` | Theme tokens | 111+ | 113+ | 16.2+ |
| View Transitions API | Route transitions (optional) | 111+ | N/A | 18+ |

## Fallback Strategy

- **Progressive enhancement:** Core functionality works without optional features.
- **View Transitions:** Gracefully degraded when unsupported (no transition, content still renders).
- **Popover API:** Polyfilled via `@solidiom/runtime` for Safari 16.x consumers (opt-in).
- **No JavaScript fallback:** Static content renders; interactive components require JS.

## Testing Infrastructure

- `tools/test/vitest.cross-browser.config.ts` — tri-browser Vitest configuration
- `docs/cross-browser-results.md` — recorded test results
- Viewport testing at 320px, 768px, 1024px, 1440px widths

## Unsupported Browser Handling

The site serves a static fallback page for unsupported browsers (detected via feature checks, not user-agent sniffing). The fallback provides:

- Project description and links
- Source access instructions
- Upgrade guidance with links to supported browsers
