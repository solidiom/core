---
contentSchemaVersion: 1
title: Separator
description: Styled separator component — the recipe wrapper for the css, tailwind, unocss profile(s) using the separator primitive.
keywords: [separator, divider, hr, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Separator
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "separator"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled separator component — the recipe wrapper for the css, tailwind, unocss profile(s) using the separator primitive.

## Usage

The Separator component is a styled recipe wrapper around the `@solidiom/separator` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Separator } from "@solidiom/recipes-css"

;<Separator orientation="horizontal" />
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/separator` primitive as a peer dependency.

## Anatomy

The Separator component wraps the `@solidiom/separator` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the separator element that applies recipe styles and delegates to the primitive.

## Variants & states

Separator inherits its variant and state support from `@solidiom/separator`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Separator is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-separator` namespace for CSS profiling and targeting.

## SSR and hydration

Separator renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Separator delegates accessibility to `@solidiom/separator`. See the [Separator primitive accessibility contract](/primitives/separator/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
