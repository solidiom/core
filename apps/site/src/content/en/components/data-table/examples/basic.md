---
contentSchemaVersion: 1
title: Basic data table
description: Data Table component with sortable columns and row data examples.
keywords: [data-table, table, sortable, rows, component]
locale: en
maturity: draft
product: Data Table
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "data-table"
section: examples
exampleId: data-table-component-basic
source:
  path: apps/site/src/components/DataTableExample.tsx
  export: DataTableExample
  language: tsx
runnable: true
---

The Data Table component is a styled recipe wrapper around the `@solidiom/data-table` primitive. It provides a sortable, selectable table with accessible header cells and row selection.

```tsx
import { StyledDataTable, DataTable } from "@solidiom/recipes-css"

const columns = [
  { id: "name", accessorKey: "name", sortable: true },
  { id: "email", accessorKey: "email", sortable: true },
]

const data = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
]

;<StyledDataTable columns={columns} data={data} rowIdKey="id">
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Name</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="email">Email</DataTable.HeaderCell>
    </tr>
  </DataTable.Header>
  <DataTable.Body>
    {data.map((row) => (
      <DataTable.Row rowId={String(row.id)}>
        <DataTable.Cell>{row.name}</DataTable.Cell>
        <DataTable.Cell>{row.email}</DataTable.Cell>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</StyledDataTable>
```

## With row selection

Enable single or multiple row selection with the `selectionMode` prop.

```tsx
import { StyledDataTable, DataTable } from "@solidiom/recipes-css"

;<StyledDataTable columns={columns} data={data} rowIdKey="id" selectionMode="single">
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Name</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="email">Email</DataTable.HeaderCell>
    </tr>
  </DataTable.Header>
  <DataTable.Body>
    {data.map((row) => (
      <DataTable.Row rowId={String(row.id)}>
        <DataTable.Cell>{row.name}</DataTable.Cell>
        <DataTable.Cell>{row.email}</DataTable.Cell>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</StyledDataTable>
```
