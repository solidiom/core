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
translationSourceHash: "fbb4e225a23f19aaa19f609b3e3dd34922316dc568d3e486473e7bcd86b38a06"
translationStatus: draft
---

El componente Resizable Panels proporciona un diseño con paneles arrastrables que pueden ser redimensionados por el usuario.

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
