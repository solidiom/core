---
contentSchemaVersion: 1
title: Tooltip - Basic usage
description: Basic tooltip example demonstrating core behavior.
keywords: [tooltip, basic, example]
locale: en
maturity: draft
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: examples
exampleId: tooltip-basic
source:
  path: packages/tooltip/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "Runnable island to be created when this primitive is fully retrofitted."
---

```tsx
import * as Tooltip from "@solidiom/tooltip"

;<Tooltip.Root openDelay={700} closeDelay={300}>
  <Tooltip.Trigger>
    <button type="button">Hover me</button>
  </Tooltip.Trigger>

  <Tooltip.Content>This is a tooltip.</Tooltip.Content>
</Tooltip.Root>
```

The tooltip appears after `openDelay` (default 700ms) on hover or focus, and dismisses after `closeDelay` (default 300ms) on mouse leave. The trigger also responds to Escape key for dismissal.
