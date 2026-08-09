---
contentSchemaVersion: 1
title: "Solidiom Beta 1"
description: "Full catalog release: 52 primitives, 30 components, 36 blocks, 29 templates, and 4 theme presets — accessible by design, bilingual, and CLI-driven."
keywords: [beta, release, changelog, primitives, components, blocks, templates, accessibility, CLI, cross-browser]
locale: en
maturity: beta
product: "Solidiom"
productLayer: changelog
status: published
date: "2026-08-07"
kind: release
version: "0.0.1-beta.1"
---

# Solidiom Beta 1

**Version:** 0.0.1-beta.1
**Date:** August 7, 2026
**Status:** Public Beta

Beta 1 marks the completion of the full catalog. Every layer — primitives, components, blocks, templates, and themes — meets the M4 Definition of Done and is ready for public evaluation.

## What's New

### Complete Catalog

- **52 primitives** — Headless, accessible building blocks with full accessibility evidence. Every primitive includes keyboard interaction contracts, ARIA semantics enforced at compile time, and committed axe-core scan results.
- **30 components** — Styled recipe wrappers for CSS, Tailwind, and UnoCSS. Compose primitives with layout, semantic styling slots, and variant support.
- **36 blocks** — Page-level composables with loading, empty, error, and restricted states. Covering authentication, settings, billing, observability, and enterprise workflows.
- **29 templates** — Full application starters with routing, state, and theming. Balanced and Enterprise portfolios for SaaS, internal tools, and commerce.
- **4 theme presets** — Ocean, Forest, Slate, and Aurora. All meet WCAG AA contrast compliance for light and dark modes.

### Accessibility

Every primitive is verified through three layers:

1. **axe-core** automated scanning in real browsers
2. **Keyboard contracts** tested with simulated key events
3. **VoiceOver evidence** captured and committed as artifacts

ARIA semantics are enforced at compile time via TypeScript generics — missing attributes cause build errors.

### Bilingual

All documentation and user-facing content available in English and Spanish. Translation completeness verified at build time: zero stale, zero missing.

### CLI with Registry Integrity

The Solidiom CLI creates projects, adds primitives, and manages your workspace. Registry packages are signed with Ed25519 keys and verified with Sigstore-based provenance.

```bash
solidiom create my-app
solidiom add accordion
solidiom registry verify
```

### Three Styling Recipes

One primitive, three styling outputs:

- **CSS** — Native custom properties and BEM-style class names
- **Tailwind** — Tailwind CSS utility composition
- **UnoCSS** — UnoCSS atomic class mapping

## Cross-Browser

Beta 1 is certified on two rendering engines:

- **Chromium** — Chrome, Edge, and Chromium-based browsers fully supported
- **Firefox** — Gecko engine fully supported

**WebKit** (Safari) testing is currently blocked by system-level dependency constraints. WebKit support is targeted for the next beta release once those dependencies resolve.

## Getting Started

### Install

```bash
npm create solidiom@latest my-app
cd my-app
npm install
npm run dev
```

### Add Your First Primitive

```bash
solidiom add accordion
```

The CLI adds the primitive, all recipe outputs, and theme compatibility to your workspace.

### Available Commands

| Command | Description |
|---------|-------------|
| `solidiom create <name>` | Scaffold a new project |
| `solidiom add <primitive>` | Add a primitive to your workspace |
| `solidiom registry verify` | Verify package integrity |
| `solidiom theme list` | List available presets |
| `solidiom theme apply <preset>` | Apply a theme preset |

## Known Limitations

### Solid 2 Beta Dependency

Solidiom is built on Solid 2, which is itself in beta. API changes in Solid 2 may cascade to Solidiom primitives.

### Deferred to Post-Beta

- **Zoom** — Content zoom beyond 200% not tested for all primitives
- **Contrast** — AAA contrast; current target is AA
- **Reduced motion** — `prefers-reduced-motion` adaptations not comprehensive
- **Screen readers** — VoiceOnly VoiceOver tested; NVDA, JAWS, TalkBack deferred
- **Touch** — Touch interaction patterns not yet verified

### API Stability

The public API may change between beta releases. No breaking changes are expected within the beta track.

## Upgrade Path

Updates between beta releases follow the changesets workflow:

```bash
npm update @solidiom/*
```

No breaking changes in this initial beta release.

## Feedback

- **Bug reports:** [GitHub Issues](https://github.com/solidiom/solidiom/issues)
- **Feature requests:** Open an issue with the `enhancement` label
- **Security:** [Responsible disclosure](https://github.com/solidiom/solidiom/security/advisories/new)
