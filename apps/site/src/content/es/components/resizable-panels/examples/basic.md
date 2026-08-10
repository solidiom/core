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
translationSourceHash: "e72be280bcc16d5d6408dd4c4f36e32e7cbea8854523dae9bb179b227777d1c4"
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
