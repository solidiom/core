---
id: known-limitations
title: "Known Limitations"
doc_type: reference
audience: "developers"
tags: [limitations, CUT-005]
lifecycle: current
date: 2026-08-07
---

# Known Limitations

**Task:** CUT-005
**Status:** Current

This document catalogs current limitations of Solidiom GA. Items are organized by severity and include target phases for resolution.

## Solid 2 Beta Dependency

**Severity:** High
**Target:** Phase 4 (v1.0 stable)

Solidiom is built on Solid 2.0.0-beta.26, which is not yet GA. API changes in Solid 2 may cascade to Solidiom primitives. This is the primary dependency risk for any production deployment.

- Solid 2 is actively developed and its API may change between beta releases
- Breaking changes in Solid 2 could require updates across all Solidiom primitives
- No formal semver guarantees until Solid 2 reaches stable release

**Mitigation:** Pin Solid 2 to the exact beta version in your project. Monitor the Solid 2 release channel for stable release announcements.

## API Stability

**Severity:** Medium
**Target:** Phase 4 (v1.0 stable)

Solidiom GA does not provide semantic versioning guarantees. The public API may change between releases until v1.0 stable is reached in Phase 4.

- No semver guarantees for the 0.x track
- Breaking changes will be documented in changelogs but are not blocked by version policy
- Internal APIs (not exported) may change without notice

**Mitigation:** Pin exact versions in production. Subscribe to the changelog feed. Review changelog before each update.

## Browser Support

**Severity:** Medium

### WebKit / Safari

Safari 17.2+ is required. WebKit has known limitations on some systems:

- Some CSS features used in recipe outputs have partial WebKit support
- System-level dependencies on some testing environments block full WebKit CI coverage
- Safari on iOS has additional constraints around focus management in some contexts

**Certified browsers:**

| Engine   | Browsers            | Status                                 |
| -------- | ------------------- | -------------------------------------- |
| Chromium | Chrome, Edge, Brave | Certified                              |
| Gecko    | Firefox             | Certified                              |
| WebKit   | Safari 17.2+        | Limited — known issues on some systems |

**Target:** Full WebKit certification is tracked for a post-GA release.

## Accessibility

**Severity:** Low
**Target:** Phase 4

Solidiom GA ships with WCAG 2.2 AA compliance, but full assistive technology coverage is not yet complete.

### Current Coverage

- **VoiceOver (macOS)** — Verified for all primitives. This is the current AT baseline.
- **axe-core** — Zero violations across all primitives.
- **Keyboard navigation** — Complete contracts for all primitives.

### Deferred to Phase 4

- **NVDA** — Windows screen reader coverage not yet tested
- **JAWS** — Windows screen reader coverage not yet tested
- **TalkBack** — Android screen reader coverage not yet tested
- **Zoom beyond 200%** — Not tested for all primitives
- **AAA contrast** — Current target is AA; AAA is deferred
- **prefers-reduced-motion** — Adaptations not comprehensive
- **Touch interactions** — Touch interaction patterns not yet verified

## Playground

**Severity:** Informational
**Target:** M6

The interactive playground for exploring primitives live in the browser is not yet available.

**Target:** Milestone M6.

## Analytics

**Severity:** Informational
**Target:** M6

Usage analytics and component adoption metrics are not yet available.

**Target:** Milestone M6.

## Newsletter

**Severity:** Informational
**Target:** M6

The newsletter subscription system is not yet available.

**Target:** Milestone M6.

## Compile-Time Optimizations

**Severity:** Informational
**Status:** Phase 3A — In incubation

Compile-time optimizations for Solidiom primitives are in incubation and not part of the GA release.

- Optimization passes are experimental and not enabled by default
- No performance guarantees for compile-time transforms
- API for optimization plugins is unstable

## Generative Authoring

**Severity:** Informational
**Status:** Phase 3B — Not started

AI-assisted component generation and design-to-code features are planned but not started.

**Target:** Phase 3B.

## Server-Side Rendering

**Severity:** Low

SSR and hydration support is present but not all edge cases are covered:

- Basic SSR works for primitives and components
- Hydration mismatches may occur in complex state scenarios
- Streaming SSR is not yet supported
- Some edge cases around focus management during hydration are not resolved

**Mitigation:** For SSR-heavy applications, test thoroughly with your specific rendering patterns. Client-side rendering is the fully supported mode.
