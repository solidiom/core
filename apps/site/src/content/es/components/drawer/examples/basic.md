---
contentSchemaVersion: 1
title: Basic drawer
description: Drawer component with slide-in panel from screen edge.
keywords: [drawer, slide-in, panel, overlay, primitive]
locale: es
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
translationSourceHash: "fcbcc489018317b70eaa11d0d3b1bc04a12ba3fdf601a2a5c5208b5c74f1961b"
translationStatus: draft
---

El componente Drawer es un panel que se desliza desde el borde de la pantalla.

```tsx
import { StyledDrawer, Drawer } from "@solidiom/recipes-css"

;<Drawer.Root>
  <Drawer.Trigger>
    <button type="button">Abrir cajón</button>
  </Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Content>
    <Drawer.Title>Cajón</Drawer.Title>
    <Drawer.Description>Contenido del cajón aquí.</Drawer.Description>
    <Drawer.Close>
      <button type="button">Cerrar</button>
    </Drawer.Close>
  </Drawer.Content>
</Drawer.Root>
```
