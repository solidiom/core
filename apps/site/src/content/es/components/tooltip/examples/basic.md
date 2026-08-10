---
contentSchemaVersion: 1
title: Tooltip básico
description: Componente de tooltip que aparece al pasar el cursor o enfocar.
keywords: [tooltip, hover, popup, overlay]
locale: es
maturity: draft
product: Tooltip
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tooltip"
section: examples
exampleId: tooltip-component-basic
source:
  path: apps/site/src/components/TooltipExample.tsx
  export: TooltipExample
  language: tsx
runnable: true
translationSourceHash: "4d62ce367c83cc6d0d5c395b248315e57c69f4b7d6d06d0e278b2641d74b0e77"
translationStatus: draft
---

El componente Tooltip muestra información complementaria cuando el usuario pasa el cursor sobre un elemento o lo enfoca.

```tsx
import { StyledTooltip, Tooltip } from "@solidiom/recipes-css"

;<Tooltip.Root>
  <Tooltip.Trigger>
    <button type="button">Pase el cursor</button>
  </Tooltip.Trigger>
  <Tooltip.Content>Contenido del tooltip</Tooltip.Content>
</Tooltip.Root>
```
