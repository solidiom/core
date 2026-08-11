---
contentSchemaVersion: 1
title: Scroll Area
description: Styled scroll area component — the recipe wrapper for the css, tailwind, unocss profile(s) using the scroll-area primitive.
keywords: [scroll-area, scroll, scrollbar, overflow, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Scroll Area
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "scroll-area"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled scroll area component — the recipe wrapper for the css, tailwind, unocss profile(s) using the scroll-area primitive.

## Usage

The Scroll Area component is a styled recipe wrapper around the `@solidiom/scroll-area` primitive. It provides custom-styled scrollbars while maintaining native scrolling performance.

```tsx
import { StyledScrollArea, ScrollArea } from "@solidiom/recipes-css"

;<StyledScrollArea style={{ height: "300px" }}>
  <ScrollArea.Viewport>
    <p>Scrollable content goes here...</p>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</StyledScrollArea>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/scroll-area` primitive as a peer dependency.

## Anatomy

The Scroll Area component wraps the `@solidiom/scroll-area` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Viewport** — the scrollable viewport container.
- **Scrollbar** — the styled scrollbar element.
- **Thumb** — the draggable thumb within the scrollbar.

## Variants & states

Scroll Area inherits its state support from `@solidiom/scroll-area`. Scrollbars carry `data-state` for visible/hidden states and support `orientation` (horizontal/vertical). Consult the primitive's documentation for the full list of supported props.

## Styling

Scroll Area is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-scroll-area` namespace for CSS profiling and targeting.

## SSR and hydration

Scroll Area renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Scroll Area delegates accessibility to `@solidiom/scroll-area`. The primitive maintains native scrolling behavior for full keyboard and screen reader compatibility. See the [Scroll Area primitive accessibility contract](/primitives/scroll-area/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
