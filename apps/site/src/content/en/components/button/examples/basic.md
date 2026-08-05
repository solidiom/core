---
contentSchemaVersion: 1
title: Basic button
description: Standard button, icon button, toggle button, and button group with recipe styling.
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
  path: apps/site/src/components/ButtonComponentExample.tsx
  export: ButtonComponentExample
  language: tsx
runnable: true
---

The Button component is a styled recipe wrapper around the `@solidiom/button` primitive. It adds variant styling, composition, and semantic styling slots while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button variant="default" size="md">Click me</Button>
```

## With variants

The component supports the same variants as the primitive, with styling applied through the recipe layer.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button variant="destructive" size="sm">Delete</Button>
;<Button variant="outline" size="lg">Cancel</Button>
;<Button variant="ghost">Secondary</Button>
;<Button variant="link">Learn more</Button>
```

## IconButton

Use `IconButton` for icon-only actions with consistent sizing.

```tsx
import { IconButton } from "@solidiom/recipes-css"

;<IconButton aria-label="Close" variant="ghost">
  <CloseIcon />
</IconButton>
```

## ToggleButton

Use `ToggleButton` for toggleable actions with styled pressed states.

```tsx
import { ToggleButton } from "@solidiom/recipes-css"
import { createSignal } from "solid-js"

const ToggleExample = () => {
  const [pressed, setPressed] = createSignal(false)

  return (
    <ToggleButton pressed={pressed()} onPressedChange={setPressed}>
      Bold
    </ToggleButton>
  )
}
```

## ButtonGroup

Use `ButtonGroup` to visually group related actions.

```tsx
import { Button, ButtonGroup } from "@solidiom/recipes-css"

;<ButtonGroup orientation="horizontal">
  <Button variant="outline">Draft</Button>
  <Button variant="outline">Preview</Button>
  <Button>Publish</Button>
</ButtonGroup>
```