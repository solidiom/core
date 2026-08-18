---
contentSchemaVersion: 1
title: Basic navigation menu
description: Navigation menu component with dropdown sub-menus.
keywords: [navigation-menu, nav, dropdown, menu, primitive]
locale: es
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
translationSourceHash: "38f0c1414a9f34441899124049771fb899141d64874f87abd6c7aa433d69a9a4"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

The Navigation Menu component is a styled recipe wrapper around the `@solidiom/navigation-menu` primitive. It provides accessible dropdown sub-menus for top-level navigation.

```tsx
import { StyledNavigationMenu, NavigationMenu } from "@solidiom/recipes-css"

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
