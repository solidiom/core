---
contentSchemaVersion: 1
title: Command Palette
description: Styled command palette component — the recipe wrapper for the css, tailwind, unocss profile(s) using the command-palette primitive.
keywords: [command-palette, command, search, modal, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Command Palette
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "command-palette"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled command palette component — the recipe wrapper for the css, tailwind, unocss profile(s) using the command-palette primitive.

## Usage

The Command Palette component is a styled recipe wrapper around the `@solidiom/command-palette` primitive. It provides a modal interface for quick command access and navigation.

```tsx
import { StyledCommandPalette } from "@solidiom/recipes-css"
import * as CommandPalette from "@solidiom/command-palette"

;<StyledCommandPalette>
  <CommandPalette.Input placeholder="Type a command..." />
  <CommandPalette.List>
    <CommandPalette.Group heading="Actions">
      <CommandPalette.Item value="new-file">New File</CommandPalette.Item>
      <CommandPalette.Item value="save">Save</CommandPalette.Item>
    </CommandPalette.Group>
  </CommandPalette.List>
</StyledCommandPalette>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/command-palette` primitive as a peer dependency.

## Anatomy

The Command Palette component wraps the `@solidiom/command-palette` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Input** — the search input for filtering commands.
- **List** — the command list container.
- **Group** — a grouped section of commands.
- **Item** — individual command option.
- **Empty** — displayed when no results match.

## Variants & states

Command Palette inherits its state support from `@solidiom/command-palette`. Items carry `data-selected` and `data-state` attributes. The primitive manages filtered results and keyboard navigation. Consult the primitive's documentation for the full list of supported props.

## Styling

Command Palette is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-command-palette` namespace for CSS profiling and targeting.

## SSR and hydration

Command Palette renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Command Palette delegates accessibility to `@solidiom/command-palette`. The primitive implements the WAI-ARIA combobox/listbox pattern with keyboard navigation and screen reader support. See the [Command Palette primitive accessibility contract](/primitives/command-palette/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
