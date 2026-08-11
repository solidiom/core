---
contentSchemaVersion: 1
title: Hover Card - Basic usage
description: Basic hover card example demonstrating core behavior.
keywords: [hover-card, basic, example]
locale: en
maturity: draft
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: examples
exampleId: hover-card-basic
source:
  path: packages/hover-card/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "Runnable island to be created when this primitive is fully retrofitted."
---

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root openDelay={700} closeDelay={300}>
  <HoverCard.Trigger>
    <a href="/profile">@johndoe</a>
  </HoverCard.Trigger>

  <HoverCard.Content>
    <div style={{ padding: 16 }}>
      <strong>John Doe</strong>
      <p style={{ margin: "8px 0 0" }}>Software developer. Building things with Solid.</p>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```

The hover card shows content after a configurable `openDelay` (default 700ms) when the trigger is hovered. The `closeDelay` (default 300ms) prevents flicker when moving between trigger and content.
