---
contentSchemaVersion: 1
title: Drawer - Basic usage
description: Basic drawer example demonstrating core behavior.
keywords: [drawer, basic, example]
locale: en
maturity: draft
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: examples
exampleId: drawer-basic
source:
  path: packages/drawer/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Drawer from "@solidiom/drawer"

;<Drawer.Root side="right" onOpenChange={(open) => console.log(open)}>
  <Drawer.Trigger>Open Drawer</Drawer.Trigger>

  <Drawer.Backdrop />

  <Drawer.Content>
    <Drawer.Close aria-label="Close drawer">✕</Drawer.Close>

    <Drawer.Title>Edit Profile</Drawer.Title>
    <Drawer.Description>
      Make changes to your profile here.
    </Drawer.Description>

    <div style={{ padding: 16 }}>
      <p>Drawer content goes here.</p>
    </div>
  </Drawer.Content>
</Drawer.Root>
```

The drawer slides in from the edge specified by `side` ("top", "right", "bottom", "left"). In modal mode (default), it includes a backdrop, focus trap, and scroll lock. Set `modal={false}` for a non-modal drawer.
