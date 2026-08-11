---
contentSchemaVersion: 1
title: Kbd
description: Styled keyboard display component — the recipe wrapper for the css, tailwind, unocss profile(s) using the kbd primitive.
keywords: [kbd, keyboard, shortcut, display, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Kbd
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "kbd"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled keyboard display component — the recipe wrapper for the css, tailwind, unocss profile(s) using the kbd primitive.

## Usage

The Kbd component is a styled recipe wrapper around the `@solidiom/kbd` primitive. It renders a semantic keyboard key element for displaying shortcuts.

```tsx
import { StyledKbd } from "@solidiom/recipes-css"

;<StyledKbd>Ctrl</StyledKbd>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/kbd` primitive as a peer dependency.

## Anatomy

The Kbd component wraps the `@solidiom/kbd` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Kbd has no variant or state support. It is a simple display element for keyboard keys.

## Styling

Kbd is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-kbd` namespace for CSS profiling and targeting.

## SSR and hydration

Kbd renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Kbd delegates accessibility to `@solidiom/kbd`. The primitive uses the native `<kbd>` element for built-in semantic meaning for keyboard input. See the [Kbd primitive accessibility contract](/primitives/kbd/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
