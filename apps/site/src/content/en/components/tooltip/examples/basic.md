---
contentSchemaVersion: 1
title: Basic tooltip
description: Tooltip component that appears on hover and focus.
keywords: [tooltip, hover, popup, overlay]
locale: en
maturity: draft
product: Tooltip
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tooltip"
section: examples
exampleId: tooltip-component-basic
source:
  path: apps/site/src/components/TooltipExample.tsx
  export: TooltipExample
  language: tsx
runnable: true
---

The Tooltip component displays supplementary information when the user hovers over or focuses on an element.

```tsx
import { StyledTooltip } from "@solidiom/recipes-css"
import * as Tooltip from "@solidiom/tooltip"

;<Tooltip.Root>
  <Tooltip.Trigger>
    <button type="button">Hover me</button>
  </Tooltip.Trigger>
  <Tooltip.Content>Tooltip content</Tooltip.Content>
</Tooltip.Root>
```
