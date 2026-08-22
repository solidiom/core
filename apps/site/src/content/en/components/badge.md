---
contentSchemaVersion: 1
title: Badge
description: Styled badge component — the recipe wrapper for the css, tailwind, unocss profile(s) using the badge primitive.
keywords: [badge, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Badge
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "badge"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled badge component — the recipe wrapper for the css, tailwind, unocss profile(s) using the badge primitive.

## Usage

The Badge component is a styled recipe wrapper around the `@solidiom/badge` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledBadge } from "@solidiom/recipes-css"

;<StyledBadge>Content</StyledBadge>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/badge` primitive as a peer dependency.

## Anatomy

The Badge component wraps the `@solidiom/badge` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Badge inherits its variant and state support from `@solidiom/badge`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Badge is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-badge` namespace for CSS profiling and targeting.

## SSR and hydration

Badge renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Badge delegates accessibility to `@solidiom/badge`. See the [Badge primitive accessibility contract](/primitives/badge/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
