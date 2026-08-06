---
contentSchemaVersion: 1
title: Basic pagination
description: Pagination component with previous, next, and page number items.
keywords: [pagination, navigation, page, numbers, component]
locale: en
maturity: draft
product: Pagination
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "pagination"
section: examples
exampleId: pagination-component-basic
source:
  path: apps/site/src/components/PaginationExample.tsx
  export: PaginationExample
  language: tsx
runnable: true
---

The Pagination component is a styled recipe wrapper around the `@solidiom/pagination` primitive. It provides page navigation with previous, next, and page number items.

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

## With ellipsis

Use the Ellipsis component to indicate skipped page ranges.

```tsx
import { StyledPagination } from "@solidiom/recipes-css"
import * as Pagination from "@solidiom/pagination"

;<StyledPagination>
  <Pagination.PreviousButton>Previous</Pagination.PreviousButton>
  <Pagination.Content>
    <Pagination.Item><button type="button">1</button></Pagination.Item>
    <Pagination.Ellipsis />
    <Pagination.Item><button type="button">8</button></Pagination.Item>
    <Pagination.Item><button type="button">9</button></Pagination.Item>
    <Pagination.Item><button type="button">10</button></Pagination.Item>
  </Pagination.Content>
  <Pagination.NextButton>Next</Pagination.NextButton>
</StyledPagination>
```