---
contentSchemaVersion: 1
title: Pagination
description: Page navigation with prev/next and page numbers.
keywords: [and, navigation, next, numbers, page, pagination, prev]
locale: en
maturity: ga
product: Pagination
productLayer: primitive
status: draft
package: "@solidiom/pagination"
primitive: pagination
section: overview
notApplicable:
  - section: relationships
    reason: Pagination has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Page navigation with prev/next and page numbers.

## Usage

Compose `Root`, `Content`, `Item`, `PreviousButton`, `NextButton`, `Ellipsis`.

```tsx
import * as Pagination from "@solidiom/pagination"

;<Pagination.Root>Pagination content</Pagination.Root>
```

## Installation

Install the package with `pnpm add @solidiom/pagination`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Pagination exposes 6 parts:

- **Root** — `data-part="root"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **PreviousButton** — `data-part="previousbutton"`.
- **NextButton** — `data-part="nextbutton"`.
- **Ellipsis** — `data-part="ellipsis"`.

## Styling

Pagination carries `data-scope="pagination"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key         | Behavior                           |
| ----------- | ---------------------------------- |
| Enter/Space | Activates the focused page button. |

## Composition

Pagination is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Pagination renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
