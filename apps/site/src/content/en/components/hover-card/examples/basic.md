---
contentSchemaVersion: 1
title: Basic hover card
description: Hover card component that displays content on hover and focus.
keywords: [hover-card, hover, popup, overlay, dialog]
locale: en
maturity: draft
product: HoverCard
productLayer: component
status: draft
package: "@solidiom/hover-card"
section: examples
exampleId: hover-card-component-basic
source:
  path: apps/site/src/components/HoverCardExample.tsx
  export: HoverCardExample
  language: tsx
  runnable: true
---

The Hover Card component displays a panel of content when the user hovers over or focuses on a trigger element.

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root>
  <HoverCard.Trigger>
    <span>Hover me</span>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <div>Content appears on hover.</div>
  </HoverCard.Content>
</HoverCard.Root>
```
