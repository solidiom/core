---
contentSchemaVersion: 1
title: Listbox
description: Styled listbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the listbox primitive.
keywords: [listbox, list, selection, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Listbox
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "listbox"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled listbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the listbox primitive.

## Usage

The Listbox component is a styled recipe wrapper around the `@solidiom/listbox` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Listbox from "@solidiom/recipes-css"

;<Listbox.Root>
  <Listbox.Label>Choose a framework</Listbox.Label>
  <Listbox.Content>
    <Listbox.Item value="solid">SolidJS</Listbox.Item>
    <Listbox.Item value="react">React</Listbox.Item>
    <Listbox.Item value="vue">Vue</Listbox.Item>
  </Listbox.Content>
</Listbox.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/listbox` primitive as a peer dependency.

## Anatomy

The Listbox component wraps the `@solidiom/listbox` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages listbox state.
- **Label** — the accessible label for the listbox.
- **Content** — the scrollable list container.
- **Item** — individual selectable item.
- **ItemGroup** — groups related items together.
- **ItemGroupLabel** — label for item groups.

## Variants & states

Listbox inherits its variant and state support from `@solidiom/listbox`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Listbox is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-listbox` namespace for CSS profiling and targeting.

## SSR and hydration

Listbox renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Listbox delegates accessibility to `@solidiom/listbox`. See the [Listbox primitive accessibility contract](/primitives/listbox/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
