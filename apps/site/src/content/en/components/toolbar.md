---
contentSchemaVersion: 1
title: Toolbar
description: Styled toolbar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toolbar primitive.
keywords: [toolbar, button, actions, controls, horizontal, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Toolbar
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toolbar"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled toolbar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toolbar primitive.

## Usage

The Toolbar component is a styled recipe wrapper around the `@solidiom/toolbar` primitive. It provides grouped actions and controls in a horizontal bar.

```tsx
import { StyledToolbar, Toolbar } from "@solidiom/recipes-css"

;<StyledToolbar>
  <Toolbar.Button>Undo</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.ToggleGroup>
    <Toolbar.ToggleItem value="bold">Bold</Toolbar.ToggleItem>
    <Toolbar.ToggleItem value="italic">Italic</Toolbar.ToggleItem>
  </Toolbar.ToggleGroup>
</StyledToolbar>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/toolbar` primitive as a peer dependency.

## Anatomy

The Toolbar component wraps the `@solidiom/toolbar` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Button** — toolbar action button.
- **Separator** — visual separator between groups.
- **ToggleGroup** — group of toggle buttons.
- **ToggleItem** — individual toggle button within a group.

## Variants & states

Toolbar inherits its state support from `@solidiom/toolbar`. The primitive supports `orientation` (horizontal/vertical). Toggle items carry `data-state="on"` or `data-state="off"`. Consult the primitive's documentation for the full list of supported props.

## Styling

Toolbar is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-toolbar` namespace for CSS profiling and targeting.

## SSR and hydration

Toolbar renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Toolbar delegates accessibility to `@solidiom/toolbar`. The primitive implements the WAI-ARIA toolbar pattern with roving tabindex keyboard navigation. See the [Toolbar primitive accessibility contract](/primitives/toolbar/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
