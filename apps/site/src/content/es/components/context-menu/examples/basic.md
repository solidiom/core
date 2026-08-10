---
contentSchemaVersion: 1
title: Menú contextual básico
description: Componente de menú contextual para acciones con clic derecho.
keywords: [context-menu, menu, right-click, menuitem]
locale: es
maturity: draft
product: ContextMenu
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "context-menu"
section: examples
exampleId: context-menu-component-basic
source:
  path: apps/site/src/components/ContextMenuExample.tsx
  export: ContextMenuExample
  language: tsx
runnable: true
translationSourceHash: "6fef38a2f0b4e570655ad008e85a198d7130efb40782da9d84d6a1f695abc4e5"
translationStatus: draft
---

El componente Context Menu muestra un menú cuando el usuario hace clic derecho en un elemento.

```tsx
import { StyledContextMenu, ContextMenu } from "@solidiom/recipes-css"

;<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div>Right-click here</div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() =>}>Copy</ContextMenu.Item>
    <ContextMenu.Item onSelect={() =>}>Paste</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem checked={false}>Show line numbers</ContextMenu.CheckboxItem>
  </ContextMenu.Content>
</ContextMenu.Root>
```
