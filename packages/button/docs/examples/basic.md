---
contentSchemaVersion: 1
title: Basic button
description: Standard button, icon button, toggle button, and button group examples.
keywords: [button, clickable, action, loading, disabled, icon, toggle, group]
locale: en
maturity: draft
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: examples
exampleId: button-basic
source:
  path: packages/button/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Button from "@solidiom/button"

;<Button.Root onClick={() => alert("clicked")}>Click me</Button.Root>
```

## With loading state

Use the `loading` prop to indicate an in-progress action. The button is automatically disabled and marked with `aria-busy="true"`.

```tsx
;<Button.Root loading>
  Saving...
</Button.Root>
```

## IconButton

Use `IconButton` for icon-only buttons. It requires `aria-label` for accessibility and wraps the icon content with `aria-hidden="true"`.

```tsx
;<Button.IconButton aria-label="Delete item">
  <TrashIcon />
</Button.IconButton>
```

## ToggleButton

Use `ToggleButton` for toggleable actions like bold or italic formatting.

```tsx
import { createSignal } from "solid-js"

const ToggleExample = () => {
  const [pressed, setPressed] = createSignal(false)

  return (
    <Button.ToggleButton pressed={pressed()} onPressedChange={setPressed}>
      Bold
    </Button.ToggleButton>
  )
}
```

## ButtonGroup

Use `ButtonGroup` to visually group related buttons together.

```tsx
;<Button.ButtonGroup orientation="horizontal">
  <Button.Root>Draft</Button.Root>
  <Button.Root>Preview</Button.Root>
  <Button.Root>Publish</Button.Root>
</Button.ButtonGroup>
```