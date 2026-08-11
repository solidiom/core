---
contentSchemaVersion: 1
title: Tree
description: Styled tree component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tree primitive.
keywords: [tree, treeview, hierarchy, file-explorer, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Tree
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "tree"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled tree component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tree primitive.

## Usage

The Tree component is a styled recipe wrapper around the `@solidiom/tree` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Tree from "@solidiom/recipes-css"

;<Tree.Root>
  <Tree.Item value="src">
    <Tree.ItemText>src</Tree.ItemText>
    <Tree.Branch>
      <Tree.Item value="index">
        <Tree.ItemText>index.ts</Tree.ItemText>
      </Tree.Item>
    </Tree.Branch>
  </Tree.Item>
</Tree.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/tree` primitive as a peer dependency.

## Anatomy

The Tree component wraps the `@solidiom/tree` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages tree state.
- **Item** — a node in the tree (may be a leaf or branch).
- **ItemText** — the text label for a tree item.
- **Branch** — a collapsible container for child items.
- **Indicator** — expand/collapse indicator for branch items.

## Variants & states

Tree inherits its variant and state support from `@solidiom/tree`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Tree is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-tree` namespace for CSS profiling and targeting.

## SSR and hydration

Tree renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Tree delegates accessibility to `@solidiom/tree`. See the [Tree primitive accessibility contract](/primitives/tree/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
