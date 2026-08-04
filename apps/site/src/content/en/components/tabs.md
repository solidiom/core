---
contentSchemaVersion: 1
title: Tabs
description: Styled tabs component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tabs primitive.
keywords: [component, css, tabs, tailwind, unocss]
locale: en
maturity: draft
product: Tabs
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tabs"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled tabs component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tabs primitive.

## Usage

The Tabs component is a styled recipe wrapper around the `@solidiom/tabs` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Tabs } from "@solidiom/recipes-css"

;<Tabs>Content</Tabs>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/tabs` primitive as a peer dependency.

## Anatomy

The Tabs component wraps the `@solidiom/tabs` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Tabs inherits its variant and state support from `@solidiom/tabs`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Tabs is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-tabs` namespace for CSS profiling and targeting.

## SSR and hydration

Tabs renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Tabs delegates accessibility to `@solidiom/tabs`. See the [Tabs primitive accessibility contract](/primitives/tabs/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
