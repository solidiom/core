---
contentSchemaVersion: 1
title: Basic dropdown menu
description: Dropdown menu component with trigger and menu items.
keywords: [menu, dropdown, context, navigation]
locale: en
maturity: draft
product: Dropdown Menu
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "menu"
section: examples
exampleId: menu-component-basic
source:
  path: apps/site/src/components/MenuExample.tsx
  export: MenuExample
  language: tsx
runnable: true
---

The Dropdown Menu component is a styled recipe wrapper around the `@solidiom/menu` primitive. It adds composition and semantic styling slots while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledMenu } from "@solidiom/recipes-css"

export function MenuExample() {
  return (
    <StyledMenu
      trigger={
        <button class="solidiom-btn">Actions</button>
      }
    >
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Edit")}>
        Edit
      </div>
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Duplicate")}>
        Duplicate
      </div>
      <hr />
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Delete")}>
        Delete
      </div>
    </StyledMenu>
  )
}
```

## Menu items

Each child of `StyledMenu` renders as a menu item. Use `onClick` or `onSelect` handlers to respond to user selection.

## Separators

Use `<hr />` between menu items to visually group related actions.