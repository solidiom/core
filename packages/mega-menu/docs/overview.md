---
contentSchemaVersion: 1
title: Mega Menu
description: Expanded navigation dropdown with rich multi-column content.
keywords: [mega menu, navigation, dropdown, multi-column, disclosure, roving focus, menu]
locale: en
maturity: ga
product: Mega Menu
productLayer: primitive
status: draft
package: "@solidiom/mega-menu"
primitive: mega-menu
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Mega Menu is an expanded navigation dropdown with rich multi-column content. It uses `createDisclosureState` for per-item open/close, `createPointerIntent` for a diagonal grace period, `createCollection` for item registration, and `createRovingFocus` for keyboard navigation between triggers.

## Usage

Compose `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Group`, and `GroupLabel`.

```tsx
import * as MegaMenu from "@solidiom/mega-menu"

function Navigation() {
  return (
    <MegaMenu.Root>
      <MegaMenu.List>
        <MegaMenu.Item>
          <MegaMenu.Trigger>Products</MegaMenu.Trigger>
          <MegaMenu.Content>
            <MegaMenu.Group>
              <MegaMenu.GroupLabel>Platform</MegaMenu.GroupLabel>
              <MegaMenu.Link href="/analytics">Analytics</MegaMenu.Link>
              <MegaMenu.Link href="/automation">Automation</MegaMenu.Link>
            </MegaMenu.Group>
          </MegaMenu.Content>
        </MegaMenu.Item>
      </MegaMenu.List>
    </MegaMenu.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/mega-menu`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

mega-menu exposes 8 parts:

- **Root** — `data-part="root"`. Navigation container coordinating disclosure and focus state.
- **List** — `data-part="list"`. Holds the top-level menu items.
- **Item** — `data-part="item"`. A single menu item with its own open/close state.
- **Trigger** — `data-part="trigger"`. Opens the item's content; participates in roving focus.
- **Content** — `data-part="content"`. Rich multi-column content panel for an item.
- **Link** — `data-part="link"`. Navigational link within the content.
- **Group** — `data-part="group"`. Groups related links within the content.
- **GroupLabel** — `data-part="grouplabel"`. Label for a group of links.

## Styling

mega-menu carries `data-scope="mega-menu"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

| Key        | Behavior                            |
| ---------- | ----------------------------------- |
| Arrow keys | Move roving focus between triggers. |

## Composition

Mega Menu composes within site headers and navigation bars, presenting grouped links and rich content per top-level item.

## SSR and hydration

Mega Menu renders its trigger and content markup on the server and activates disclosure, pointer-intent, and roving-focus behavior on hydration.
