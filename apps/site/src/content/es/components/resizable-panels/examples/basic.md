---
contentSchemaVersion: 1
title: Basic resizable panels
description: Resizable panels component with draggable split-panel layout.
keywords: [resizable-panels, panel, layout, resize, split, primitive]
locale: es
maturity: draft
product: Resizable Panels
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "resizable-panels"
section: examples
exampleId: resizable-panels-component-basic
source:
  path: apps/site/src/components/ResizablePanelsExample.tsx
  export: ResizablePanelsExample
  language: tsx
  runnable: true
translationSourceHash: "26591f9d865ffa7abcf91b31a02627947fed71249420c7ba23c99596ab1c3f1a"
translationStatus: draft
---

The Resizable Panels component is a styled recipe wrapper around the `@solidiom/resizable-panels` primitive. It provides a draggable split-panel layout.

```tsx
import { StyledResizablePanels } from "@solidiom/recipes-css"
import { Panel, Handle } from "@solidiom/resizable-panels"

;<StyledResizablePanels direction="horizontal">
  <Panel defaultSize={50}>Panel 1</Panel>
  <Handle />
  <Panel defaultSize={50}>Panel 2</Panel>
</StyledResizablePanels>
```
