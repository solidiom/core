---
contentSchemaVersion: 1
title: "Solidiom GA — General Availability"
description: "Solidiom is now GA: 52 primitives, 30 components, 36 blocks, 29 templates, signed registry, CLI with Sigstore verification, WCAG 2.2 AA compliance, bilingual support, and cross-browser certification."
keywords:
  [
    ga,
    general-availability,
    release,
    changelog,
    primitives,
    components,
    blocks,
    templates,
    accessibility,
    CLI,
    registry,
    cross-browser,
  ]
locale: en
maturity: ga
product: "Solidiom"
productLayer: changelog
status: published
date: "2026-08-07"
kind: release
version: "0.0.1-ga"
---

# Solidiom GA — General Availability

**Version:** 0.0.1-ga
**Date:** August 7, 2026
**Status:** General Availability

Solidiom GA marks the general availability of a complete, accessible, bilingual component platform built on Solid 2. This release publishes the full catalog, a signed V3 registry, a production CLI, cross-browser certification, and infrastructure behind a live site at solidiom.org.

## What's in GA

### Complete Catalog

- **52 primitives** — All stable. Headless, accessible building blocks with full accessibility evidence.
- **30 components** — Styled recipe wrappers for CSS, Tailwind, and UnoCSS.
- **36 blocks** — Page-level composables across 12 categories: authentication, settings, billing, observability, enterprise workflows, data tables, forms, navigation, overlays, content, feedback, and layout.
- **29 templates** — Full application starters with routing, state, and theming. Balanced and Enterprise portfolios.
- **4 theme presets** — Ocean, Forest, Slate, and Aurora. All meet WCAG AA contrast compliance.
- **3 styling recipes** — CSS, Tailwind, and UnoCSS. One primitive, three styling outputs.

### Accessibility

WCAG 2.2 AA compliance verified through three automated layers and manual evidence across seven dimensions:

1. **axe-core scans** — Zero violations across all primitives
2. **Keyboard audit** — Complete keyboard interaction contracts for every primitive
3. **VoiceOver verification** — Screen reader evidence captured and committed
4. **7-dimension manual evidence** — Keyboard navigation, focus management, ARIA semantics, screen reader announcements, color contrast, cognitive load, and error handling

ARIA semantics are enforced at compile time via TypeScript generics.

### Bilingual

All documentation and user-facing content available in English and Spanish. Translations are human-reviewed and verified at build time.

### Registry with Cryptographic Integrity

The V3 registry index provides cryptographic integrity for all published packages:

- **Ed25519 signing** — Every package signed with an Ed25519 key pair
- **Integrity hashes** — SHA-256 hashes for all package assets
- **Signed pointer** — A single signed index points to all package manifests

### CLI with Sigstore Verification

The `solidiom` CLI manages your workspace with Sigstore-based verification:

```bash
solidiom create my-app
solidiom add accordion
solidiom verify
solidiom diff
solidiom plan my-project
```

### Cross-Browser Certified

- **Chromium** — Chrome, Edge, and Chromium-based browsers fully supported
- **Firefox** — Gecko engine fully supported
- **Safari 17.2+** — WebKit has known limitations on some systems

### Infrastructure

- **Cloudflare Pages** — Global CDN with edge caching and automatic HTTPS
- **Security headers** — CSP, HSTS, X-Frame-Options configured
- **Cache strategy** — Optimized cache headers for static and dynamic content

## Getting Started

### Install

```bash
npm create solidiom@latest my-app
cd my-app
npm install
npm run dev
```

### Add Your First Component

```bash
solidiom add accordion
```

## Upgrade from Beta

```bash
npm update @solidiom/*
```

## Known Limitations

Solid 2.0.0-beta.26 is the underlying dependency and is not GA. No semver guarantees until v1.0 stable (Phase 4). Full AT coverage (NVDA, JAWS, TalkBack), the interactive playground, analytics, and newsletter are deferred to later milestones. See the [Limitations](/articles/limitations) page for details.

## Feedback

- **Bug reports:** [GitHub Issues](https://github.com/solidiom/solidiom/issues)
- **Feature requests:** Open an issue with the `enhancement` label
- **Security:** [Responsible disclosure](https://github.com/solidiom/solidiom/security/advisories/new)
