---
contentSchemaVersion: 1
title: Slider
description: Styled slider component — the recipe wrapper for the css, tailwind, unocss profile(s) using the slider primitive.
keywords: [slider, range, input, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Slider
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "slider"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled slider component — the recipe wrapper for the css, tailwind, unocss profile(s) using the slider primitive.

## Usage

The Slider component is a styled recipe wrapper around the `@solidiom/slider` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Slider from "@solidiom/recipes-css"

;<Slider.Root min={0} max={100} value={50}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/slider` primitive as a peer dependency.

## Anatomy

The Slider component wraps the `@solidiom/slider` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages slider state.
- **Track** — the track along which the thumb slides.
- **Range** — the filled portion of the track.
- **Thumb** — the draggable handle.
- **Label** — optional accessible label.

## Variants & states

Slider inherits its variant and state support from `@solidiom/slider`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Slider is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-slider` namespace for CSS profiling and targeting.

## SSR and hydration

Slider renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Slider delegates accessibility to `@solidiom/slider`. See the [Slider primitive accessibility contract](/primitives/slider/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
