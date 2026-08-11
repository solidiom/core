---
contentSchemaVersion: 1
title: Context Menu
description: Styled context menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the context-menu primitive.
keywords: [context-menu, right-click, menu, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Context Menu
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "context-menu"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled context menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the context-menu primitive.

## Usage

The Context Menu component is a styled recipe wrapper around the `@solidiom/context-menu` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as ContextMenu from "@solidiom/recipes-css"

;<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Cut</ContextMenu.Item>
    <ContextMenu.Item>Copy</ContextMenu.Item>
    <ContextMenu.Item>Paste</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/context-menu` primitive as a peer dependency.

## Anatomy

The Context Menu component wraps the `@solidiom/context-menu` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages menu state.
- **Trigger** — the element that opens the menu on right-click.
- **Content** — the menu panel containing items.
- **Item** — individual menu item.
- **Separator** — visual separator between menu groups.
- **Sub** — submenu container for nested menus.

## Variants & states

Context Menu inherits its variant and state support from `@solidiom/context-menu`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Context Menu is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-context-menu` namespace for CSS profiling and targeting.

## SSR and hydration

Context Menu renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Context Menu delegates accessibility to `@solidiom/context-menu`. See the [Context Menu primitive accessibility contract](/primitives/context-menu/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
