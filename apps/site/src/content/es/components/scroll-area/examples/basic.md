---
contentSchemaVersion: 1
title: Área de desplazamiento básica
description: Componente de área de desplazamiento con barras de desplazamiento personalizadas.
keywords: [scroll-area, scroll, scrollbar, overflow, primitive]
locale: es
maturity: draft
product: Scroll Area
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "scroll-area"
section: examples
exampleId: scroll-area-component-basic
source:
  path: apps/site/src/components/ScrollAreaExample.tsx
  export: ScrollAreaExample
  language: tsx
  runnable: true
translationSourceHash: "a85a0b505300fe38adc42f855813f6e0a56f93fa1fee0616b94d23bd62659103"
translationStatus: draft
---

El componente Scroll Area proporciona un contenedor desplazable con estilos personalizados y una barra de desplazamiento visible.

```tsx
import { StyledScrollArea, ScrollArea } from "@solidiom/recipes-css"

;<StyledScrollArea type="always" style={{ height: "200px" }}>
  <ScrollArea.Viewport>
    <p>Contenido desplazable aquí...</p>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</StyledScrollArea>
```
