---
contentSchemaVersion: 1
title: Switch
description: Styled switch component — the recipe wrapper for the css, tailwind, unocss profile(s) using the switch primitive.
keywords: [component, css, switch, tailwind, unocss]
locale: en
maturity: beta
product: Switch
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "switch"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled switch component — the recipe wrapper for the css, tailwind, unocss profile(s) using the switch primitive.

## Usage

The Switch component is a styled recipe wrapper around the `@solidiom/switch` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Switch } from "@solidiom/recipes-css"

;<Switch>Content</Switch>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/switch` primitive as a peer dependency.

## Anatomy

The Switch component wraps the `@solidiom/switch` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Switch inherits its variant and state support from `@solidiom/switch`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Switch is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-switch` namespace for CSS profiling and targeting.

## SSR and hydration

Switch renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Switch delegates accessibility to `@solidiom/switch`. See the [Switch primitive accessibility contract](/primitives/switch/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
