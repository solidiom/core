---
contentSchemaVersion: 1
title: Sheet
description: Styled sheet component — the recipe wrapper for the css, tailwind, unocss profile(s) using the sheet primitive.
keywords: [sheet, side-panel, dialog, overlay, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Sheet
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "sheet"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled sheet component — the recipe wrapper for the css, tailwind, unocss profile(s) using the sheet primitive.

## Usage

The Sheet component is a styled recipe wrapper around the `@solidiom/sheet` primitive. It provides a side-panel overlay dialog that slides in from any edge.

```tsx
import { StyledSheet, Sheet } from "@solidiom/recipes-css"

;<StyledSheet>
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Title>Sheet Title</Sheet.Title>
    <Sheet.Description>Sheet content goes here.</Sheet.Description>
  </Sheet.Content>
</StyledSheet>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/sheet` primitive as a peer dependency.

## Anatomy

The Sheet component wraps the `@solidiom/sheet` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Trigger** — the button that opens the sheet.
- **Portal** — renders content into a portal layer.
- **Backdrop** — the overlay behind the sheet.
- **Content** — the sheet panel that slides in.
- **Title** — accessible title for the sheet.
- **Description** — accessible description.
- **Close** — close button.

## Variants & states

Sheet inherits its state support from `@solidiom/sheet`. The primitive supports a `side` prop (left, right, top, bottom) to control slide direction. Open/closed state drives presence animations. Consult the primitive's documentation for the full list of supported props.

## Styling

Sheet is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-sheet` namespace for CSS profiling and targeting.

## SSR and hydration

Sheet renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Sheet delegates accessibility to `@solidiom/sheet`. The primitive implements modal isolation, focus scope management, and scroll lock for accessible overlay dialogs. See the [Sheet primitive accessibility contract](/primitives/sheet/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
