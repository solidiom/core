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
translationSourceHash: "2734513466a958fe45f2c3989889df7a3313e3132bd20dafb989aca26e62b0c9"
translationStatus: draft
---

El componente Drawer es un panel que se desliza desde el borde de la pantalla.

```tsx
import { StyledDrawer, Drawer } from "@solidiom/recipes-css"

;<Drawer.Root>
  <Drawer.Trigger><button type="button">Abrir cajón</button></Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Content>
    <Drawer.Title>Cajón</Drawer.Title>
    <Drawer.Description>Contenido del cajón aquí.</Drawer.Description>
    <Drawer.Close><button type="button">Cerrar</button></Drawer.Close>
  </Drawer.Content>
</Drawer.Root>
```
