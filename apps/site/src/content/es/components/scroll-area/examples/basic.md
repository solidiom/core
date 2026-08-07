---
contentSchemaVersion: 1
title: Basic scroll area
description: Scroll area component with custom-styled scrollbars.
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
translationSourceHash: "43ccf233da2d73a151313c169c5b43aa62c4f7b8c6f7ebcbea39b32f36ccdecd"
translationStatus: draft
---

The Scroll Area component is a styled recipe wrapper around the `@solidiom/scroll-area` primitive. It provides custom-styled scrollbars with native scrolling performance.

```tsx
import { StyledScrollArea, ScrollArea } from "@solidiom/recipes-css"

;<StyledScrollArea style={{ height: "300px" }}>
  <ScrollArea.Viewport>
    <p>Scrollable content goes here...</p>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</StyledScrollArea>
```
