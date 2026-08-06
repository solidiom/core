---
contentSchemaVersion: 1
title: Basic scroll area
description: Scroll area component with custom-styled scrollbars.
keywords: [scroll-area, scroll, scrollbar, overflow, primitive]
locale: en
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
