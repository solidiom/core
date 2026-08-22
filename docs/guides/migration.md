---
id: migration-guide
title: "Migration Guide"
doc_type: guide
audience: "developers"
tags: [migration, CUT-005]
lifecycle: current
date: 2026-08-07
---

# Migration Guide

**Task:** CUT-005
**Status:** Current

Solidiom is a greenfield product. There are no prior Solidiom versions to migrate from. This guide covers the paths developers take to adopt Solidiom: starting from scratch, integrating with an existing Solid 2 project, and replacing other UI component libraries.

## Starting from Scratch

The most common adoption path. Create a new project with the Solidiom CLI:

```bash
npx @solidiom/cli create my-app
cd my-app
pnpm install
pnpm run dev
```

The `create` command scaffolds a complete project with routing, state management, and a configured build pipeline.

### Add Your First Primitive

```bash
solidiom add accordion
```

The CLI resolves the requested deliverable and prints or runs the package-manager install command. Theme files are not added automatically; install `@solidiom/themes` and import a theme entrypoint when needed.

### Recipe Selection

The recipe packages expose CSS, Tailwind, and UnoCSS profiles for their supported primitive set. Check each package's exported `supportedPrimitives` list; not every registry primitive currently has a `Styled*` wrapper.

- **CSS** — Native custom properties and BEM-style class names. No build-time CSS processor required.
- **Tailwind** — Tailwind CSS utility composition. Requires Tailwind in your project.
- **UnoCSS** — UnoCSS atomic class mapping. Requires UnoCSS in your project.

## Starting from an Existing Solid 2 Project

If you already have a Solid 2 application and want to adopt Solidiom components:

### 1. Install the CLI

```bash
pnpm add @solidiom/cli
```

The package provides the `solidiom` executable.

### 2. Initialize Solidiom in Your Project

```bash
solidiom plan accordion
```

The `plan` command resolves one named primitive or deliverable and shows the planned packages/files. It is not a whole-project scanner.

### 3. Add Primitives Incrementally

```bash
solidiom add accordion
solidiom add dialog
solidiom add tabs
```

Each `add` operation is independent — you can adopt primitives one at a time without modifying your existing code.

### 4. Verify Integrity

```bash
solidiom verify --registry
```

For an artifact, pass its path explicitly, for example `solidiom verify ./dist/dialog.tgz`.

## Coming from Other UI Libraries

Solidiom's headless primitives are designed to be a drop-in replacement for accessible component libraries. Here are adoption notes from popular libraries:

### From Shoelace

Shoelace uses Web Components. Solidiom uses Solid 2 components. Migration considerations:

- **Custom elements vs. JSX** — Shoelace components are `<sl-button>` custom elements. Solidiom primitives are JSX components imported from packages.
- **Styling** — Shoelace has built-in styling. Solidiom separates headless primitives from styled recipes. Use `solidiom add` to get both.
- **Accessibility** — Both libraries prioritize accessibility. Solidiom's compile-time ARIA enforcement catches issues earlier.

### From Kobalte

Kobalte is also a headless Solid component library. Migration considerations:

- **API parity** — Many Kobalte primitives have direct Solidiom equivalents with similar APIs.
- **Recipe system** — Solidiom adds a recipe layer on top of headless primitives for consistent styling outputs.
- **Registry** — Solidiom's signed V3 registry provides cryptographic verification of package integrity.

### From Radix UI

Radix UI is a React component library. If you're moving from Radix + React to Solidiom + Solid 2:

- **Framework change** — This is a full framework migration, not just a component swap. Consider the Solid 2 migration guides.
- **Primitives parity** — Radix primitives have Solidiom equivalents (Dialog, Tabs, Accordion, Select, etc.).
- **Styling approach** — Radix uses CSS-in-JS. Solidiom's recipe system offers CSS, Tailwind, or UnoCSS outputs.

## Documentation

> **Note:** The legacy docs application (`apps/docs`) has been removed. All documentation is now hosted at `apps/site` and published at [solidiom.org](https://solidiom.org).

### Content Available

- **Guides** — Step-by-step tutorials and how-to articles
- **References** — API references, interaction contracts, accessibility evidence
- **Articles** — Deep-dive articles on architecture, accessibility, and design decisions
- **Changelog** — Release notes and migration guidance

### Bilingual Support

All documentation is available in English and Spanish. Switch languages in the site UI or browse the `es/` content directory.
