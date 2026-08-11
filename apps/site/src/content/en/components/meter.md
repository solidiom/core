---
contentSchemaVersion: 1
title: Meter
description: Styled meter component — the recipe wrapper for the css, tailwind, unocss profile(s) using the meter primitive.
keywords: [meter, measurement, gauge, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Meter
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "meter"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled meter component — the recipe wrapper for the css, tailwind, unocss profile(s) using the meter primitive.

## Usage

The Meter component is a styled recipe wrapper around the `@solidiom/meter` primitive. It adds composition, semantic styling slots, and status-based styling while delegating all value normalization and threshold logic to the underlying primitive.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={0.7} min={0} max={1} />
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/meter` primitive as a peer dependency.

## Anatomy

The Meter component wraps the `@solidiom/meter` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Meter inherits its variant and state support from `@solidiom/meter`. The primitive derives status states ("safe", "caution", "danger") from value thresholds (low, high, optimum). Consult the primitive's documentation for the full list of supported props and interactive states.

## Styling

Meter is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-meter` namespace for CSS profiling and targeting.

## SSR and hydration

Meter renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Meter delegates accessibility to `@solidiom/meter`. The primitive uses the native `<meter>` element for built-in accessibility semantics. See the [Meter primitive accessibility contract](/primitives/meter/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.