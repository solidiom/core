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
package: "@solidiom/recipes-css"
recipe: "hover-card"
section: examples
exampleId: hover-card-component-basic
source:
  path: apps/site/src/components/HoverCardExample.tsx
  export: HoverCardExample
  language: tsx
  runnable: true
translationSourceHash: "78e71b50a0b7e754c6fc43a2ea472f1f4a2b93d706f68fb4e68a25df0f96278d"
translationStatus: draft
---

El componente Hover Card muestra un panel de contenido cuando el usuario pasa el cursor sobre un elemento de disparador o lo enfoca.

```tsx
import { StyledHoverCard, HoverCard } from "@solidiom/recipes-css"

;<HoverCard.Root>
  <HoverCard.Trigger>
    <span>Pase el cursor</span>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <div>El contenido aparece al pasar el cursor.</div>
  </HoverCard.Content>
</HoverCard.Root>
```
