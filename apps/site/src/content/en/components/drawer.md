---
contentSchemaVersion: 1
title: Drawer
description: Styled drawer component — the recipe wrapper for the css, tailwind, unocss profile(s) using the drawer primitive.
keywords: [drawer, panel, slide, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Drawer
productLayer: component
status: published
package: "@solidiom/drawer"
---

Styled drawer component — the recipe wrapper for the css, tailwind, unocss profile(s) using the drawer primitive.

## Usage

The Drawer component is a styled recipe wrapper around the `@solidiom/drawer` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as Drawer from "@solidiom/drawer"

;<Drawer.Root>
  <Drawer.Trigger>Open drawer</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Drawer Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>Content goes here</Drawer.Body>
    <Drawer.Footer>
      <Drawer.CloseTrigger>Close</Drawer.CloseTrigger>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Installation

```sh
pnpm add @solidiom/drawer
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/drawer` primitive as a peer dependency.

## Anatomy

The Drawer component wraps the `@solidiom/drawer` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that opens the drawer.
- **Content** — the slide-in panel container.
- **Header** — the drawer header area.
- **Title** — the drawer heading.
- **Body** — the main content area.
- **Footer** — the drawer footer with actions.
- **CloseTrigger** — the button that closes the drawer.

## Variants & states

Drawer inherits its variant and state support from `@solidiom/drawer`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Drawer is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-drawer` namespace for CSS profiling and targeting.

## SSR and hydration

Drawer renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Drawer delegates accessibility to `@solidiom/drawer`. See the [Drawer primitive accessibility contract](/primitives/drawer/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
