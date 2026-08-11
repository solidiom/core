---
contentSchemaVersion: 1
title: Resizable Panels
description: Styled resizable panels component — the recipe wrapper for the css, tailwind, unocss profile(s) using the resizable-panels primitive.
keywords: [resizable-panels, panel, layout, resize, split, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Resizable Panels
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "resizable-panels"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled resizable panels component — the recipe wrapper for the css, tailwind, unocss profile(s) using the resizable-panels primitive.

## Usage

The Resizable Panels component is a styled recipe wrapper around the `@solidiom/resizable-panels` primitive. It provides a draggable split-panel layout with resizable sections.

```tsx
import { StyledResizablePanels } from "@solidiom/recipes-css"
import { Panel, Handle } from "@solidiom/resizable-panels"

;<StyledResizablePanels direction="horizontal">
  <Panel defaultSize={50}>Panel 1</Panel>
  <Handle />
  <Panel defaultSize={50}>Panel 2</Panel>
</StyledResizablePanels>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/resizable-panels` primitive as a peer dependency.

## Anatomy

The Resizable Panels component wraps the `@solidiom/resizable-panels` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root (PanelGroup)** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Panel** — a resizable panel section.
- **Handle** — the draggable resize handle between panels.

## Variants & states

Resizable Panels inherits its state support from `@solidiom/resizable-panels`. The primitive supports `direction` (horizontal/vertical) and panel constraints (min size, max size). Consult the primitive's documentation for the full list of supported props.

## Styling

Resizable Panels is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-resizable-panels` namespace for CSS profiling and targeting.

## SSR and hydration

Resizable Panels renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Resizable Panels delegates accessibility to `@solidiom/resizable-panels`. The primitive provides keyboard-accessible resize handles and semantic panel structure. See the [Resizable Panels primitive accessibility contract](/primitives/resizable-panels/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
