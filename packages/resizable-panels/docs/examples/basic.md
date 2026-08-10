---
contentSchemaVersion: 1
title: Resizable Panels - Basic usage
description: Basic resizable panels example demonstrating core behavior.
keywords: [resizable-panels, basic, example]
locale: en
maturity: draft
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: examples
exampleId: resizable-panels-basic
source:
  path: packages/resizable-panels/src/index.tsx
  export: PanelGroup
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as ResizablePanels from "@solidiom/resizable-panels"

;<ResizablePanels.PanelGroup
  direction="horizontal"
  onSizesChange={(sizes) => console.log(sizes)}
>
  <ResizablePanels.Panel order={0} defaultSize={60} minSize={20}>
    <div style={{ padding: 16 }}>Left panel</div>
  </ResizablePanels.Panel>

  <ResizablePanels.Handle index={0} />

  <ResizablePanels.Panel order={1} defaultSize={40} minSize={20}>
    <div style={{ padding: 16 }}>Right panel</div>
  </ResizablePanels.Panel>
</ResizablePanels.PanelGroup>
```

The Handle sits between two panels at the given `index` (separating panel[index] and panel[index+1]). Use `collapsible` on a Panel to allow it to shrink to 0%. The `direction` prop controls horizontal (default) or vertical layout.
