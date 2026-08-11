---
contentSchemaVersion: 1
title: Breadcrumb
description: Styled breadcrumb component — the recipe wrapper for the css, tailwind, unocss profile(s) using the breadcrumb primitive.
keywords: [breadcrumb, navigation, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Breadcrumb
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "breadcrumb"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled breadcrumb component — the recipe wrapper for the css, tailwind, unocss profile(s) using the breadcrumb primitive.

## Usage

The Breadcrumb component is a styled recipe wrapper around the `@solidiom/breadcrumb` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledBreadcrumb, Breadcrumb } from "@solidiom/recipes-css"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>Breadcrumb</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/breadcrumb` primitive as a peer dependency.

## Anatomy

The Breadcrumb component wraps the `@solidiom/breadcrumb` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **List** — the ordered list container for breadcrumb items.
- **Item** — individual breadcrumb entry.
- **Link** — navigation link within a breadcrumb item.
- **Separator** — visual separator between breadcrumb items.
- **Ellipsis** — indicator for skipped breadcrumb items.

## Variants & states

Breadcrumb inherits its variant and state support from `@solidiom/breadcrumb`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Breadcrumb is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-breadcrumb` namespace for CSS profiling and targeting.

## SSR and hydration

Breadcrumb renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Breadcrumb delegates accessibility to `@solidiom/breadcrumb`. See the [Breadcrumb primitive accessibility contract](/primitives/breadcrumb/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.