---
contentSchemaVersion: 1
title: Data Table
description: Tabla headless ordenable con visibilidad de columnas, selección de filas y delegación de ordenamiento mediante adaptador.
keywords: [tabla, datos, ordenar, columnas, filas, selección]
locale: es
maturity: beta
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: overview
---

Data Table proporciona un primitivo de tabla headless y composable con ordenamiento integrado, control de visibilidad de columnas y selección de filas. Delega el cálculo de ordenamiento a través del patrón adaptador para que los consumidores puedan conectar motores externos sin acoplarse a una implementación específica.

## Uso

Compón `Root`, `Header`, `HeaderCell`, `Body`, `Row` y `Cell`. Define las columnas con objetos `ColumnDef` que declaran el identificador de cada columna, la etiqueta de encabezado, la clave de acceso y si es ordenable.

```tsx
import * as DataTable from "@solidiom/data-table"

const columns = [
  { id: "name", header: "Nombre", accessorKey: "name", sortable: true },
  { id: "year", header: "Año", accessorKey: "year", sortable: true },
  { id: "paradigm", header: "Paradigma", accessorKey: "paradigm" },
]

const data = [
  { id: "1", name: "Rust", year: "2010", paradigm: "Sistemas" },
  { id: "2", name: "TypeScript", year: "2012", paradigm: "Multi-paradigma" },
  { id: "3", name: "Go", year: "2009", paradigm: "Concurrente" },
]

;<DataTable.Root columns={columns} data={data}>
  <DataTable.Header>
    <tr>
      <DataTable.HeaderCell columnId="name">Nombre</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="year">Año</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="paradigm">Paradigma</DataTable.HeaderCell>
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

## Patrón adaptador

La interfaz `TableModelPort` permite delegar el cálculo de ordenamiento a un motor externo. Pasa una prop `modelPort` a `Root` con un método `sort(rows, columnId, direction)`. Cuando no se proporciona un port, el ordenamiento integrado usa comparación de cadenas mediante `localeCompare`.

## Definiciones de columna

Cada `ColumnDef` declara:

- **id** — identificador único de columna usado para el estado de ordenamiento y seguimiento de visibilidad.
- **header** — etiqueta visible para el encabezado de la columna.
- **accessorKey** — clave en el objeto de datos de la fila para extraer el valor de la celda.
- **sortable** — indica si al hacer clic o presionar Enter/Espacio en el encabezado se alterna la dirección de ordenamiento.

## Instalación

Instala el paquete con `pnpm add @solidiom/data-table`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.
