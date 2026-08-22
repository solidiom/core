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
translationSourceHash: "8af5242ef1631b36c7a2250cd6ce5445c7e412b8b1eb5ce278507c7801b11a6d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Tooltip muestra información complementaria cuando el usuario pasa el cursor sobre un elemento o lo enfoca.

```tsx
import { StyledTooltip } from "@solidiom/recipes-css"
import * as Tooltip from "@solidiom/tooltip"

;<Tooltip.Root>
  <Tooltip.Trigger>
    <button type="button">Pase el cursor</button>
  </Tooltip.Trigger>
  <Tooltip.Content>Contenido del tooltip</Tooltip.Content>
</Tooltip.Root>
```
