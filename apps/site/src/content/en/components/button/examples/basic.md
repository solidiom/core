---
contentSchemaVersion: 1
title: Basic button
description: Standard button, toggle button, and button group using the button primitive with recipe styles.
keywords: [button, component, styled, recipe, variants]
locale: en
maturity: draft
product: Button
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "button"
section: examples
exampleId: button-component-basic
source:
  path: apps/site/src/components/ButtonExample.tsx
  export: ButtonExample
  language: tsx
runnable: true
---

The executable example uses the `@solidiom/button` primitive and the CSS recipe stylesheet. The recipe package exports `StyledButton`; it does not export `Button`, `IconButton`, `ToggleButton`, or `ButtonGroup` under those names.

```tsx
import * as Button from "@solidiom/button"
import "@solidiom/recipes-css/styles/button.css"

;<Button.Root loading={false}>Click me</Button.Root>
```

## Toggle button

`ToggleButton` is exported by the button primitive:

```tsx
import * as Button from "@solidiom/button"

;<Button.ToggleButton pressed={false} onPressedChange={() => undefined}>
  Bold
</Button.ToggleButton>
```

## Button group

`ButtonGroup` is also exported by the button primitive:

```tsx
import * as Button from "@solidiom/button"

;<Button.ButtonGroup orientation="horizontal">
  <Button.Root>Draft</Button.Root>
  <Button.Root>Preview</Button.Root>
  <Button.Root>Publish</Button.Root>
</Button.ButtonGroup>
```
