---
contentSchemaVersion: 1
title: Collapsible
description: Styled collapsible component — the recipe wrapper for the css, tailwind, unocss profile(s) using the collapsible primitive.
keywords: [collapsible, disclosure, expand, collapse, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Collapsible
productLayer: component
status: published
package: "@solidiom/collapsible"
---

Styled collapsible component — the recipe wrapper for the css, tailwind, unocss profile(s) using the collapsible primitive.

## Usage

The Collapsible component is a styled recipe wrapper around the `@solidiom/collapsible` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Collapsible from "@solidiom/collapsible"

;<Collapsible.Root>
  <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content can be expanded or collapsed.</p>
  </Collapsible.Content>
</Collapsible.Root>
```

## Installation

```sh
pnpm add @solidiom/collapsible
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/collapsible` primitive as a peer dependency.

## Anatomy

The Collapsible component wraps the `@solidiom/collapsible` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that toggles the content visibility.
- **Content** — the collapsible content panel.

## Variants & states

Collapsible inherits its variant and state support from `@solidiom/collapsible`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Collapsible is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-collapsible` namespace for CSS profiling and targeting.

## SSR and hydration

Collapsible renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Collapsible delegates accessibility to `@solidiom/collapsible`. See the [Collapsible primitive accessibility contract](/primitives/collapsible/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
