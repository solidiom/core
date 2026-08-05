---
contentSchemaVersion: 1
title: Basic tooltip
description: Tooltip component with delay and positioning examples.
keywords: [tooltip, hover, overlay, hint, primitive]
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

The Tooltip component is a styled recipe wrapper around the `@solidiom/tooltip` primitive. It provides a lightweight overlay with configurable delay and positioning, activated on focus and hover.

```tsx
import { StyledTooltip, Tooltip } from "@solidiom/recipes-css"

;<StyledTooltip>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>Helpful information</Tooltip.Content>
</StyledTooltip>
```

## With custom delay

Control the delay before the tooltip appears.

```tsx
import { StyledTooltip, Tooltip } from "@solidiom/recipes-css"

;<StyledTooltip delayDuration={300}>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>Appears after 300ms</Tooltip.Content>
</StyledTooltip>
```