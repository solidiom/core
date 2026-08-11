---
contentSchemaVersion: 1
title: Toggle Group
description: Styled toggle group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle-group primitive.
keywords: [toggle-group, button-group, segmented, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Toggle Group
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toggle-group"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled toggle group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle-group primitive.

## Usage

The Toggle Group component is a styled recipe wrapper around the `@solidiom/toggle-group` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as ToggleGroup from "@solidiom/recipes-css"

;<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/toggle-group` primitive as a peer dependency.

## Anatomy

The Toggle Group component wraps the `@solidiom/toggle-group` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages group state and selection.
- **Item** — individual toggle button within the group.

## Variants & states

Toggle Group inherits its variant and state support from `@solidiom/toggle-group`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Toggle Group is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-toggle-group` namespace for CSS profiling and targeting.

## SSR and hydration

Toggle Group renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Toggle Group delegates accessibility to `@solidiom/toggle-group`. See the [Toggle Group primitive accessibility contract](/primitives/toggle-group/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
