---
contentSchemaVersion: 1
title: Hover Card
description: Styled hover card component — the recipe wrapper for the css, tailwind, unocss profile(s) using the hover-card primitive.
keywords: [hover-card, popover, preview, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Hover Card
productLayer: component
status: published
package: "@solidiom/hover-card"
---

Styled hover card component — the recipe wrapper for the css, tailwind, unocss profile(s) using the hover-card primitive.

## Usage

The Hover Card component is a styled recipe wrapper around the `@solidiom/hover-card` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Preview content appears on hover.</p>
  </HoverCard.Content>
</HoverCard.Root>
```

## Installation

```sh
pnpm add @solidiom/hover-card
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/hover-card` primitive as a peer dependency.

## Anatomy

The Hover Card component wraps the `@solidiom/hover-card` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages hover state.
- **Trigger** — the element that triggers the card on hover.
- **Content** — the card panel that appears on hover.
- **Arrow** — optional arrow pointing to the trigger.

## Variants & states

Hover Card inherits its variant and state support from `@solidiom/hover-card`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Hover Card is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-hover-card` namespace for CSS profiling and targeting.

## SSR and hydration

Hover Card renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Hover Card delegates accessibility to `@solidiom/hover-card`. See the [Hover Card primitive accessibility contract](/primitives/hover-card/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
