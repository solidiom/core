---
contentSchemaVersion: 1
title: Menu
description: Styled menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the menu primitive.
keywords: [component, css, menu, tailwind, unocss]
locale: en
maturity: beta
product: Menu
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "menu"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the menu primitive.

## Usage

The Menu component is a styled recipe wrapper around the `@solidiom/menu` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledMenu } from "@solidiom/recipes-css"

;<StyledMenu>Content</StyledMenu>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/menu` primitive as a peer dependency.

## Anatomy

The Menu component wraps the `@solidiom/menu` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Menu inherits its variant and state support from `@solidiom/menu`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Menu is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-menu` namespace for CSS profiling and targeting.

## SSR and hydration

Menu renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Menu delegates accessibility to `@solidiom/menu`. See the [Menu primitive accessibility contract](/primitives/menu/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
