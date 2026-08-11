---
contentSchemaVersion: 1
title: Data Table
description: Styled data table component — the recipe wrapper for the css, tailwind, unocss profile(s) using the data-table primitive.
keywords: [data-table, table, sortable, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Data Table
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "data-table"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled data table component — the recipe wrapper for the css, tailwind, unocss profile(s) using the data-table primitive.

## Usage

The Data Table component is a styled recipe wrapper around the `@solidiom/data-table` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledDataTable, DataTable } from "@solidiom/recipes-css"

const columns = [
  { id: "name", accessorKey: "name", sortable: true },
  { id: "email", accessorKey: "email", sortable: true },
]

const data = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
]

;<StyledDataTable columns={columns} data={data} rowIdKey="id">
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Name</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="email">Email</DataTable.HeaderCell>
    </tr>
  </DataTable.Header>
  <DataTable.Body>{/* Row rendering handled by consumer */}</DataTable.Body>
</StyledDataTable>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/data-table` primitive as a peer dependency.

## Anatomy

The Data Table component wraps the `@solidiom/data-table` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper `<table>` element that applies recipe styles and delegates to the primitive.
- **Header** — the `<thead>` section.
- **HeaderCell** — the `<th>` cells with sort toggle support.
- **Body** — the `<tbody>` section.
- **Row** — the `<tr>` elements with selection support.
- **Cell** — the `<td>` data cells.

## Variants & states

Data Table inherits its variant and state support from `@solidiom/data-table`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Data Table is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-data-table` namespace for CSS profiling and targeting.

## SSR and hydration

Data Table renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Data Table delegates accessibility to `@solidiom/data-table`. See the [Data Table primitive accessibility contract](/primitives/data-table/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
