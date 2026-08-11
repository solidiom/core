---
contentSchemaVersion: 1
title: "Known Limitations"
description: "Current limitations of Solidiom GA including Solid 2 beta dependency, API stability, browser support, accessibility coverage, and deferred features."
keywords: [limitations, known-issues, browser-support, accessibility, solid-2, api-stability]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [limitations, solid-2, operations]
---

# Known Limitations

This page documents current limitations of Solidiom GA. Each limitation includes its severity, target resolution phase, and any available mitigations.

## Solid 2 Beta Dependency

**Severity:** High — **Target:** Phase 4 (v1.0 stable)

Solidiom is built on Solid 2.0.0-beta.26, which is not yet GA. API changes in Solid 2 may cascade to Solidiom primitives. This is the primary dependency risk for production deployments.

**Mitigation:** Pin Solid 2 to the exact beta version in your project. Monitor the Solid 2 release channel for stable release announcements.

## API Stability

**Severity:** Medium — **Target:** Phase 4 (v1.0 stable)

No semantic versioning guarantees until v1.0 stable. The public API may change between releases in the 0.x track. Breaking changes will be documented in changelogs.

**Mitigation:** Pin exact versions in production. Review the changelog before each update.

## Browser Support

**Severity:** Medium

Safari 17.2+ is required. WebKit has known limitations on some systems. Chromium (Chrome, Edge) and Firefox are fully certified.

| Engine   | Browsers            | Status                                 |
| -------- | ------------------- | -------------------------------------- |
| Chromium | Chrome, Edge, Brave | Certified                              |
| Gecko    | Firefox             | Certified                              |
| WebKit   | Safari 17.2+        | Limited — known issues on some systems |

## Accessibility Coverage

**Severity:** Low — **Target:** Phase 4

WCAG 2.2 AA is met. VoiceOver (macOS) is the current assistive technology baseline. Full AT coverage — NVDA, JAWS, and TalkBack — is deferred to Phase 4. Additional deferred items include zoom beyond 200%, AAA contrast, comprehensive `prefers-reduced-motion` adaptations, and touch interaction patterns.

## Playground

**Severity:** Informational — **Target:** M6

The interactive playground for exploring primitives in the browser is not yet available.

## Analytics

**Severity:** Informational — **Target:** M6

Usage analytics and component adoption metrics are not yet available.

## Newsletter

**Severity:** Informational — **Target:** M6

The newsletter subscription system is not yet available.

## Compile-Time Optimizations

**Severity:** Informational — **Status:** Phase 3A, in incubation

Compile-time optimizations are experimental and not enabled by default. No performance guarantees for compile-time transforms. The optimization plugin API is unstable.

## Generative Authoring

**Severity:** Informational — **Status:** Phase 3B, not started

AI-assisted component generation and design-to-code features are planned but not started.

## Server-Side Rendering

**Severity:** Low

SSR and hydration support is present but not all edge cases are covered. Basic SSR works for primitives and components. Hydration mismatches may occur in complex state scenarios. Streaming SSR is not yet supported. Client-side rendering is the fully supported mode.
