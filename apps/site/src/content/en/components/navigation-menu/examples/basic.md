---
contentSchemaVersion: 1
title: Basic navigation menu
description: Navigation menu component with dropdown sub-menus.
keywords: [navigation-menu, nav, dropdown, menu, primitive]
locale: en
maturity: draft
product: Navigation Menu
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "navigation-menu"
section: examples
exampleId: navigation-menu-component-basic
source:
  path: apps/site/src/components/NavigationMenuExample.tsx
  export: NavigationMenuExample
  language: tsx
  runnable: true
---

The Navigation Menu component is a styled recipe wrapper around the `@solidiom/navigation-menu` primitive. It provides accessible dropdown sub-menus for top-level navigation.

```tsx
import { StyledNavigationMenu } from "@solidiom/recipes-css"
import * as NavigationMenu from "@solidiom/navigation-menu"

;<StyledNavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/a">Product A</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</StyledNavigationMenu>
```
