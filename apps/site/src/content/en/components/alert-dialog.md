---
contentSchemaVersion: 1
title: Alert Dialog
description: Styled alert dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert-dialog primitive.
keywords: [alert-dialog, modal, confirmation, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Alert Dialog
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "alert-dialog"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled alert dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert-dialog primitive.

## Usage

The Alert Dialog component is a styled recipe wrapper around the `@solidiom/alert-dialog` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as AlertDialog from "@solidiom/recipes-css"

;<AlertDialog.Root>
  <AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Are you sure?</AlertDialog.Title>
    <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Confirm</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/alert-dialog` primitive as a peer dependency.

## Anatomy

The Alert Dialog component wraps the `@solidiom/alert-dialog` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that opens the dialog.
- **Content** — the dialog panel containing the alert message and actions.
- **Title** — the dialog heading.
- **Description** — the dialog description text.
- **Cancel** — the button that dismisses the dialog without action.
- **Action** — the button that confirms the destructive action.

## Variants & states

Alert Dialog inherits its variant and state support from `@solidiom/alert-dialog`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Alert Dialog is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-alert-dialog` namespace for CSS profiling and targeting.

## SSR and hydration

Alert Dialog renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Alert Dialog delegates accessibility to `@solidiom/alert-dialog`. See the [Alert Dialog primitive accessibility contract](/primitives/alert-dialog/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
