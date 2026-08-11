---
contentSchemaVersion: 1
title: Paginación básica
description: Componente de paginación con anterior, siguiente y números de página.
keywords: [pagination, navigation, page, numbers, component]
locale: es
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
translationSourceHash: "dff095187aaa52eb3dafec34c75c0642bc864f52362ef2ab38913d4b2750d6ca"
translationStatus: draft
---

El componente Pagination es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/pagination`. Proporciona navegación de páginas con botones anterior, siguiente y números de página.

```tsx
import { StyledPagination } from "@solidiom/recipes-css"
import * as Pagination from "@solidiom/pagination"

;<StyledPagination>
  <Pagination.PreviousButton>Anterior</Pagination.PreviousButton>
  <Pagination.Content>
    <Pagination.Item>
      <button type="button">1</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">2</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">3</button>
    </Pagination.Item>
  </Pagination.Content>
  <Pagination.NextButton>Siguiente</Pagination.NextButton>
</StyledPagination>
```

## Con puntos suspensivos

Usa el componente Ellipsis para indicar rangos de páginas omitidas.

```tsx
import { StyledPagination } from "@solidiom/recipes-css"
import * as Pagination from "@solidiom/pagination"

;<StyledPagination>
  <Pagination.PreviousButton>Anterior</Pagination.PreviousButton>
  <Pagination.Content>
    <Pagination.Item>
      <button type="button">1</button>
    </Pagination.Item>
    <Pagination.Ellipsis />
    <Pagination.Item>
      <button type="button">8</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">9</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">10</button>
    </Pagination.Item>
  </Pagination.Content>
  <Pagination.NextButton>Siguiente</Pagination.NextButton>
</StyledPagination>
```
