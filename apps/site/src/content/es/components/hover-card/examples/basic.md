---
contentSchemaVersion: 1
title: Tarjeta hover básica
description: Componente de tarjeta hover que muestra contenido al pasar el cursor o enfocar.
keywords: [hover-card, hover, popup, overlay, dialog]
locale: es
maturity: draft
product: HoverCard
productLayer: component
status: draft
package: "@solidiom/hover-card"
section: examples
exampleId: hover-card-component-basic
source:
  path: apps/site/src/components/HoverCardExample.tsx
  export: HoverCardExample
  language: tsx
  runnable: true
translationSourceHash: "74e49a7a3163dcfa2c858037b04b826e9d7f6537e4e398cbc300619188bd2e47"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Hover Card muestra un panel de contenido cuando el usuario pasa el cursor sobre un elemento de disparador o lo enfoca.

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root>
  <HoverCard.Trigger>
    <span>Pase el cursor</span>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <div>El contenido aparece al pasar el cursor.</div>
  </HoverCard.Content>
</HoverCard.Root>
```
