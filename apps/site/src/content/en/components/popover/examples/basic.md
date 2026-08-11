---
contentSchemaVersion: 1
title: Basic popover
description: Popover component with controlled and uncontrolled examples.
keywords: [popover, overlay, menu, popup, primitive]
locale: en
maturity: draft
product: Popover
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "popover"
section: examples
exampleId: popover-component-basic
source:
  path: apps/site/src/components/PopoverExample.tsx
  export: PopoverExample
  language: tsx
runnable: true
---

The Popover component is a styled recipe wrapper around the `@solidiom/popover` primitive. It provides an overlay panel positioned near a trigger element, with focus management and escape-to-close behavior.

```tsx
import { StyledPopover, Popover } from "@solidiom/recipes-css"

;<StyledPopover>
  <Popover.Trigger>Open popover</Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Popover</Popover.Title>
    <Popover.Description>Content displayed in an overlay.</Popover.Description>
  </Popover.Content>
</StyledPopover>
```

## Controlled popover

Use controlled mode when managing open state from parent state.

```tsx
import { createSignal } from "solid-js"
import { StyledPopover, Popover } from "@solidiom/recipes-css"

export function ControlledPopover() {
  const [open, setOpen] = createSignal(false)

  return (
    <StyledPopover open={open()} onOpenChange={setOpen}>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Controlled</Popover.Title>
        <Popover.Description>State managed externally.</Popover.Description>
      </Popover.Content>
    </StyledPopover>
  )
}
```
