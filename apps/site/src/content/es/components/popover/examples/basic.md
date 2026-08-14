---
contentSchemaVersion: 1
title: Basic popover
description: Popover component with controlled and uncontrolled examples.
keywords: [popover, overlay, menu, popup, primitive]
locale: es
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
translationSourceHash: "e7eda9411245f33c3eb92ab0c476840553cd97e5bc54eddc0159a5728e85a2e6"
translationStatus: draft
---

El componente Popover es un wrapper de receta con estilos sobre el primitivo `@solidiom/popover`. Proporciona un panel superpuesto posicionado cerca de un elemento disparador, con gestión de foco y comportamiento de cierre con escape.

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

## Popover controlado

Usa el modo controlado cuando gestionas el estado de apertura desde el estado del componente padre.

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
