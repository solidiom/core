---
contentSchemaVersion: 1
title: Button
description: Styled button component — the recipe wrapper for the css, tailwind, unocss profile(s) using the button primitive.
keywords: [button, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Button
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "button"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled button component — the recipe wrapper for the css, tailwind, unocss profile(s) using the button primitive.

## Usage

The Button component is a styled recipe wrapper around the `@solidiom/button` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button>Content</Button>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/button` primitive as a peer dependency.

## Anatomy

The Button component wraps the `@solidiom/button` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Button inherits its variant and state support from `@solidiom/button`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Button is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-button` namespace for CSS profiling and targeting.

## SSR and hydration

Button renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Button delegates accessibility to `@solidiom/button`. See the [Button primitive accessibility contract](/primitives/button/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
