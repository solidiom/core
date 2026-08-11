---
contentSchemaVersion: 1
title: Virtual List
description: Styled virtual list component — the recipe wrapper for the css, tailwind, unocss profile(s) using the virtual-list primitive.
keywords: [virtual-list, virtualization, infinite-scroll, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Virtual List
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "virtual-list"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled virtual list component — the recipe wrapper for the css, tailwind, unocss profile(s) using the virtual-list primitive.

## Usage

The Virtual List component is a styled recipe wrapper around the `@solidiom/virtual-list` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as VirtualList from "@solidiom/recipes-css"

;<VirtualList.Root count={10000} estimateSize={() => 40}>
  {(item) => <VirtualList.Item>{item.index}</VirtualList.Item>}
</VirtualList.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/virtual-list` primitive as a peer dependency.

## Anatomy

The Virtual List component wraps the `@solidiom/virtual-list` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages virtualization state.
- **Item** — individual rendered item within the visible window.

## Variants & states

Virtual List inherits its variant and state support from `@solidiom/virtual-list`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Virtual List is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-virtual-list` namespace for CSS profiling and targeting.

## SSR and hydration

Virtual List renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Virtual List delegates accessibility to `@solidiom/virtual-list`. See the [Virtual List primitive accessibility contract](/primitives/virtual-list/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
