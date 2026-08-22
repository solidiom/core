---
contentSchemaVersion: 1
title: Menubar
description: Desktop-style horizontal menu bar with dropdown submenus.
keywords: [menubar, menu, navigation, dropdown, submenu, keyboard, desktop]
locale: en
maturity: ga
product: Menubar
productLayer: primitive
status: draft
package: "@solidiom/menubar"
primitive: menubar
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Menubar is a desktop-style horizontal menu bar with dropdown submenus. It supports keyboard navigation between triggers, opening menus and submenus, and dismissal.

## Usage

Compose `Root`, `Menu`, `Trigger`, `Content`, `Item`, `Separator`, `SubMenu`, `SubTrigger`, and `SubContent`.

```tsx
import * as Menubar from "@solidiom/menubar"

function AppMenubar() {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>New</Menubar.Item>
          <Menubar.Separator />
          <Menubar.SubMenu>
            <Menubar.SubTrigger>Open Recent</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item>project-a</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.SubMenu>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/menubar`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

menubar exposes 9 parts:

- **Root** — `data-part="root"`. Horizontal menu bar container.
- **Menu** — `data-part="menu"`. A single top-level menu with its trigger and content.
- **Trigger** — `data-part="trigger"`. Opens a menu from the menubar.
- **Content** — `data-part="content"`. Dropdown content panel for a menu.
- **Item** — `data-part="item"`. A selectable menu item.
- **Separator** — `data-part="separator"`. Visual separator between items.
- **SubMenu** — `data-part="submenu"`. A nested submenu within a menu.
- **SubTrigger** — `data-part="subtrigger"`. Opens a submenu.
- **SubContent** — `data-part="subcontent"`. Content panel for a submenu.

## Styling

menubar carries `data-scope="menubar"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

| Key                    | Behavior                            |
| ---------------------- | ----------------------------------- |
| ArrowLeft / ArrowRight | Move between menubar triggers.      |
| ArrowDown              | Opens a menu.                       |
| ArrowRight             | On a SubTrigger, opens the submenu. |
| Escape                 | Closes the open menu.               |

## Composition

Menubar composes within application chromes and toolbars, hosting menus, items, separators, and nested submenus.

## SSR and hydration

Menubar renders its trigger and content markup on the server and activates keyboard navigation and menu behavior on hydration.
