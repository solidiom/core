---
contentSchemaVersion: 1
title: Data Table
description: Headless sortable table with column visibility, row selection, and adapter-based sort delegation.
keywords: [table, data, sort, columns, rows, selection]
locale: en
maturity: beta
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: overview
---

Data Table provides a headless, composable table primitive with built-in sorting, column visibility control, and row selection. It delegates sort computation through the adapter pattern so consumers can plug in external engines without coupling to a specific implementation.

## Usage

Compose `Root`, `Header`, `HeaderCell`, `Body`, `Row`, and `Cell`. Define columns with `ColumnDef` objects that declare each column's identifier, header label, accessor key, and whether it is sortable.

```tsx
import * as DataTable from "@solidiom/data-table"

const columns = [
  { id: "name", header: "Name", accessorKey: "name", sortable: true },
  { id: "year", header: "Year", accessorKey: "year", sortable: true },
  { id: "paradigm", header: "Paradigm", accessorKey: "paradigm" },
]

const data = [
  { id: "1", name: "Rust", year: "2010", paradigm: "Systems" },
  { id: "2", name: "TypeScript", year: "2012", paradigm: "Multi-paradigm" },
  { id: "3", name: "Go", year: "2009", paradigm: "Concurrent" },
]

;<DataTable.Root columns={columns} data={data}>
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Name</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="year">Year</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="paradigm">Paradigm</DataTable.HeaderCell>
    </tr>
  </DataTable.Header>
  <DataTable.Body>
    {data.map((row) => (
      <DataTable.Row rowId={row.id}>
        <DataTable.Cell>{row.name}</DataTable.Cell>
        <DataTable.Cell>{row.year}</DataTable.Cell>
        <DataTable.Cell>{row.paradigm}</DataTable.Cell>
      </DataTable.Row>
    ))}
  </DataTable.Body>
</DataTable.Root>
```

## Adapter pattern

The `TableModelPort` interface lets you delegate sort computation to an external engine. Pass a `modelPort` prop to `Root` with a `sort(rows, columnId, direction)` method. When no port is provided, the built-in sort uses string comparison via `localeCompare`.

## Column definitions

Each `ColumnDef` declares:

- **id** — unique column identifier used for sort state and visibility tracking.
- **header** — display label for the column header.
- **accessorKey** — key on the row data object to extract the cell value.
- **sortable** — whether clicking or pressing Enter/Space on the header toggles sort direction.

## Installation

Install the package with `pnpm add @solidiom/data-table`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.
