---
contentSchemaVersion: 1
title: Navigation Menu
description: Styled navigation menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the navigation-menu primitive.
keywords: [navigation-menu, nav, dropdown, menu, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Navigation Menu
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "navigation-menu"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled navigation menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the navigation-menu primitive.

## Usage

The Navigation Menu component is a styled recipe wrapper around the `@solidiom/navigation-menu` primitive. It provides accessible dropdown sub-menus for top-level navigation.

```tsx
import { StyledNavigationMenu, NavigationMenu } from "@solidiom/recipes-css"

;<StyledNavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/products/a">Product A</NavigationMenu.Link>
        <NavigationMenu.Link href="/products/b">Product B</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</StyledNavigationMenu>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/navigation-menu` primitive as a peer dependency.

## Anatomy

The Navigation Menu component wraps the `@solidiom/navigation-menu` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **List** — the navigation list container.
- **Item** — individual menu item with sub-menu support.
- **Trigger** — the button that opens sub-menu content.
- **Content** — the dropdown sub-menu panel.
- **Link** — navigation link within content.

## Variants & states

Navigation Menu inherits its state support from `@solidiom/navigation-menu`. Items carry `data-state` attributes for open/closed sub-menus. The primitive manages pointer intent, keyboard navigation, and sub-menu timing. Consult the primitive's documentation for the full list of supported props.

## Styling

Navigation Menu is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-navigation-menu` namespace for CSS profiling and targeting.

## SSR and hydration

Navigation Menu renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Navigation Menu delegates accessibility to `@solidiom/navigation-menu`. The primitive implements the WAI-ARIA navigation menu pattern with keyboard navigation and screen reader support. See the primitive's `evidence.json` for the accessibility contract and test results.
