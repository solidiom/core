---
contentSchemaVersion: 1
title: Basic resizable panels
description: Resizable panels component with draggable split-panel layout.
keywords: [resizable-panels, panel, layout, resize, split, primitive]
locale: en
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
---

The Resizable Panels component provides a layout with draggable panels that can be resized by the user.

```tsx
import { StyledResizablePanels, ResizablePanels } from "@solidiom/recipes-css"

;<ResizablePanels.PanelGroup direction="horizontal" defaultSizes={[50, 50]}>
  <ResizablePanels.Panel order={0} defaultSize={50}>
    <div>Panel 1</div>
  </ResizablePanels.Panel>
  <ResizablePanels.Handle index={0}>
    <div className="handle" />
  </ResizablePanels.Handle>
  <ResizablePanels.Panel order={1} defaultSize={50}>
    <div>Panel 2</div>
  </ResizablePanels.Panel>
</ResizablePanels.PanelGroup>
```
