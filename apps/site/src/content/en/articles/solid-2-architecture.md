---
contentSchemaVersion: 1
title: "Building on Solid 2: Architecture Decisions"
description: "How Solidiom leverages Solid 2's fine-grained reactivity for accessible, performant UI primitives."
keywords: [solid-2, architecture, reactivity, signals, primitives, article]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [architecture, solid-2, reactivity]
---

# Building on Solid 2: Architecture Decisions

Solidiom is built exclusively on Solid 2. This article explains why, and how the framework's reactive primitives inform our component architecture.

## Why Solid 2

Solid's fine-grained reactivity model eliminates the virtual DOM diffing overhead that other frameworks carry. For a component library focused on accessibility and performance, this matters:

- **No wasted renders** — only the exact DOM nodes affected by a state change update
- **Predictable timing** — effects run synchronously after state changes, making focus management reliable
- **Small runtime** — no reconciler overhead means smaller bundles per primitive
- **Composition over inheritance** — signals and stores compose naturally without provider hell

## Reactive Accessibility

Traditional component libraries fight their framework to manage focus. When a dialog opens, the library must ensure focus moves into the dialog _after_ it renders. In React, this requires refs, effects, and careful timing. In Solid 2, the DOM is updated synchronously:

```tsx
function openDialog() {
  setOpen(true)
  // DOM is already updated — focus management is immediate
  dialogRef.focus()
}
```

This synchronous model is why every Solidiom primitive can guarantee its keyboard contract without race conditions.

## Signal-Driven State Machines

Each interactive primitive is modeled as a state machine driven by signals:

- **Disclosure** — `open` signal drives accordion, dialog, popover, tooltip
- **Selection** — `value` signal drives tabs, select, radio-group, listbox
- **Navigation** — `activeIndex` signal drives menu, combobox, tree
- **Validation** — `validity` signal drives field, input, form controls

The state machine is the primitive. Styling is a separate layer (recipes) that reads the same signals via data attributes.

## Primitives as Boundaries

Solidiom draws a hard boundary between primitives and styled components:

- **Primitives** own behavior: state machines, keyboard handling, ARIA attributes
- **Recipes** own appearance: colors, spacing, typography, animations
- **Templates** own composition: how primitives and recipes combine into pages

This separation means you can swap styling profiles (CSS, Tailwind, UnoCSS) without touching behavior, and upgrade primitives without breaking your design.

## What This Means for Consumers

1. **No React compatibility layer** — Solidiom is Solid-native, not a port
2. **No runtime overhead** — primitives compile to direct DOM operations
3. **Predictable bundle sizes** — each primitive is independently tree-shakeable
4. **Future-proof** — when Solid 2 reaches stable, Solidiom moves with it
