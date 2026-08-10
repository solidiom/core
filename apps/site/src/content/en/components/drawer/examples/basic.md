---
contentSchemaVersion: 1
title: Basic drawer
description: Drawer component with slide-in panel from screen edge.
keywords: [drawer, slide-in, panel, overlay, primitive]
locale: en
maturity: draft
product: Drawer
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "drawer"
section: examples
exampleId: drawer-component-basic
source:
  path: apps/site/src/components/DrawerExample.tsx
  export: DrawerExample
  language: tsx
  runnable: true
---

The Drawer component is a panel that slides in from the edge of the screen.

```tsx
import { StyledDrawer, Drawer } from "@solidiom/recipes-css"

;<Drawer.Root>
  <Drawer.Trigger><button type="button">Open drawer</button></Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Content>
    <Drawer.Title>Drawer</Drawer.Title>
    <Drawer.Description>Drawer content here.</Drawer.Description>
    <Drawer.Close><button type="button">Close</button></Drawer.Close>
  </Drawer.Content>
</Drawer.Root>
```
