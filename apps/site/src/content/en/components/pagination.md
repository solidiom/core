---
contentSchemaVersion: 1
title: Pagination
description: Styled pagination component — the recipe wrapper for the css, tailwind, unocss profile(s) using the pagination primitive.
keywords: [pagination, navigation, page, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Pagination
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "pagination"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled pagination component — the recipe wrapper for the css, tailwind, unocss profile(s) using the pagination primitive.

## Usage

The Pagination component is a styled recipe wrapper around the `@solidiom/pagination` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledPagination } from "@solidiom/recipes-css"
import * as Pagination from "@solidiom/pagination"

;<StyledPagination>
  <Pagination.PreviousButton>Previous</Pagination.PreviousButton>
  <Pagination.Content>
    <Pagination.Item><button type="button">1</button></Pagination.Item>
    <Pagination.Item><button type="button">2</button></Pagination.Item>
    <Pagination.Item><button type="button">3</button></Pagination.Item>
  </Pagination.Content>
  <Pagination.NextButton>Next</Pagination.NextButton>
</StyledPagination>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/pagination` primitive as a peer dependency.

## Anatomy

The Pagination component wraps the `@solidiom/pagination` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Content** — the list container for page items.
- **Item** — individual page number items.
- **PreviousButton** — navigation button to go to the previous page.
- **NextButton** — navigation button to go to the next page.
- **Ellipsis** — visual separator for skipped pages.

## Variants & states

Pagination inherits its variant and state support from `@solidiom/pagination`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Pagination is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-pagination` namespace for CSS profiling and targeting.

## SSR and hydration

Pagination renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Pagination delegates accessibility to `@solidiom/pagination`. See the [Pagination primitive accessibility contract](/primitives/pagination/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.