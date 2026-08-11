---
contentSchemaVersion: 1
title: Carousel
description: Styled carousel component — the recipe wrapper for the css, tailwind, unocss profile(s) using the carousel primitive.
keywords: [carousel, slider, slideshow, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Carousel
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "carousel"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled carousel component — the recipe wrapper for the css, tailwind, unocss profile(s) using the carousel primitive.

## Usage

The Carousel component is a styled recipe wrapper around the `@solidiom/carousel` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Carousel from "@solidiom/recipes-css"

;<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
</Carousel.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/carousel` primitive as a peer dependency.

## Anatomy

The Carousel component wraps the `@solidiom/carousel` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages carousel state.
- **Content** — the scrollable container for slides.
- **Item** — individual slide within the carousel.
- **PrevTrigger** — navigates to the previous slide.
- **NextTrigger** — navigates to the next slide.
- **Indicators** — dot indicators showing current position.

## Variants & states

Carousel inherits its variant and state support from `@solidiom/carousel`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Carousel is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-carousel` namespace for CSS profiling and targeting.

## SSR and hydration

Carousel renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Carousel delegates accessibility to `@solidiom/carousel`. See the [Carousel primitive accessibility contract](/primitives/carousel/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
