---
contentSchemaVersion: 1
title: Scroll Area - Basic usage
description: Basic scroll area example demonstrating core behavior.
keywords: [scroll-area, basic, example]
locale: en
maturity: draft
product: Scroll Area
productLayer: primitive
status: draft
package: "@solidiom/scroll-area"
primitive: scroll-area
section: examples
exampleId: scroll-area-basic
source:
  path: packages/scroll-area/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as ScrollArea from "@solidiom/scroll-area"

;<ScrollArea.Root type="hover">
  <ScrollArea.Viewport style={{ height: 300 }}>
    <div style={{ padding: 16 }}>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i}>Line {i + 1} of scrollable content.</p>
      ))}
    </div>
  </ScrollArea.Viewport>

  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>

  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

The scrollbar visibility is controlled by the `type` prop: "auto" (overflow only), "always", "hover" (default), or "scroll" (visible during scroll then hides after `scrollHideDelay` ms).
