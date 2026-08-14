---
contentSchemaVersion: 1
title: Tabla de datos básica
description: Componente Data Table con ejemplos de columnas ordenables y datos de filas.
keywords: [data-table, table, sortable, rows, component]
locale: es
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
translationSourceHash: "352bd574fdd546ce08d451f66a89e6e213413bc212d33d12dc22f066f19ef1b8"
translationStatus: draft
---

El componente Data Table es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/data-table`. Proporciona una tabla ordenable y seleccionable con celdas de encabezado accesibles y selección de filas.

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
      <DataTable.HeaderCell columnId="name">Nombre</DataTable.HeaderCell>
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

## Con selección de filas

Habilita selección de filas simple o múltiple con la propiedad `selectionMode`.

```tsx
import { StyledDataTable, DataTable } from "@solidiom/recipes-css"

;<StyledDataTable columns={columns} data={data} rowIdKey="id" selectionMode="single">
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Nombre</DataTable.HeaderCell>
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
