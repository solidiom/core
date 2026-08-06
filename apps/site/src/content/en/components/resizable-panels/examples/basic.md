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
