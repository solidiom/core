---
contentSchemaVersion: 1
title: Skeleton
description: Styled skeleton component — the recipe wrapper for the css, tailwind, unocss profile(s) using the skeleton primitive.
keywords: [skeleton, loading, placeholder, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Skeleton
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "skeleton"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled skeleton component — the recipe wrapper for the css, tailwind, unocss profile(s) using the skeleton primitive.

## Usage

The Skeleton component is a styled recipe wrapper around the `@solidiom/skeleton` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Skeleton } from "@solidiom/recipes-css"

;<div>
  <Skeleton variant="circle" />
  <Skeleton variant="text" />
  <Skeleton variant="rectangular" />
</div>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/skeleton` primitive as a peer dependency.

## Anatomy

The Skeleton component wraps the `@solidiom/skeleton` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the skeleton element that applies recipe styles and the pulsing animation.

## Variants & states

Skeleton inherits its variant and state support from `@solidiom/skeleton`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Skeleton is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-skeleton` namespace for CSS profiling and targeting.

## SSR and hydration

Skeleton renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Skeleton delegates accessibility to `@solidiom/skeleton`. See the [Skeleton primitive accessibility contract](/primitives/skeleton/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
