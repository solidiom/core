---
contentSchemaVersion: 1
title: Basic context menu
description: Context menu component for right-click actions.
keywords: [context-menu, menu, right-click, menuitem]
locale: en
maturity: draft
product: ContextMenu
productLayer: component
status: draft
package: "@solidiom/context-menu"
section: examples
exampleId: context-menu-component-basic
source:
  path: apps/site/src/components/ContextMenuExample.tsx
  export: ContextMenuExample
  language: tsx
runnable: true
---

The Context Menu component displays a menu when the user right-clicks on an element.

```tsx
import * as ContextMenu from "@solidiom/context-menu"

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
