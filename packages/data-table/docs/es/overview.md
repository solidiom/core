---
contentSchemaVersion: 1
title: Data Table
description: Tabla ordenable sin estilos con visibilidad de columnas, selección de filas y delegación de orden basada en adaptador.
keywords: [tabla, datos, ordenar, columnas, filas, selección]
locale: es
maturity: ga
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: overview
notApplicable:
  - section: relationships
    reason: Data Table no tiene primitivos hermanos. Se compone con Checkbox, Pagination y motores adaptadores pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. El comportamiento de orden y adaptador está documentado arriba.
translationSourceHash: "e79d89e64950977b0983ba96f28e37d0657f0d8270f3f1e918544210b478dc4b"
translationStatus: draft
---

Data Table proporciona un primitivo de tabla componible y sin estilos con ordenamiento incorporado, control de visibilidad de columnas y selección de filas. Delega el cómputo de orden a través del patrón adaptador para que los consumidores puedan conectar motores externos sin acoplarse a una implementación específica.

## Uso

Compón `Root`, `Header`, `HeaderCell`, `Body`, `Row` y `Cell`. Define las columnas con objetos `ColumnDef` que declaran el identificador, la etiqueta del encabezado, la clave de acceso y si es ordenable.

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

La interfaz `TableModelPort` permite delegar el cómputo de orden a un motor externo. Pasa un prop `modelPort` a `Root` con un método `sort(rows, columnId, direction)`. Cuando no se proporciona un port, el orden incorporado usa comparación de cadenas mediante `localeCompare`.

## Definiciones de columna

Cada `ColumnDef` declara:

- **id** — identificador único de columna para seguimiento de estado de orden y visibilidad.
- **header** — etiqueta visible para el encabezado de la columna.
- **accessorKey** — clave en el objeto de datos de la fila para extraer el valor de la celda.
- **sortable** — si hacer clic o presionar Enter/Space en el encabezado alterna la dirección de orden.

## Instalación

Instala el paquete con `pnpm add @solidiom/data-table`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Data Table expone seis partes:

- **Root** — el contenedor que gestiona el estado de orden, visibilidad de columnas y selección de filas. Acepta `columns`, `data`, `modelPort` y props de selección.
- **Header** — el contenedor `<thead>` para filas de encabezado.
- **HeaderCell** — un encabezado de columna ordenable (`<th>`). Lleva `aria-sort` y comportamiento de alternancia.
- **Body** — el contenedor `<tbody>` para filas de datos.
- **Row** — un `<tr>` que representa un registro de datos. Lleva `data-selected` cuando la selección de filas está activa.
- **Cell** — una celda de datos `<td>`.

## Estilos

Data Table incluye recetas CSS, Tailwind y UnoCSS. Las partes llevan los atributos `data-scope="data-table"` y `data-part`. HeaderCell expone `data-sort-direction="asc"` o `"desc"` cuando está ordenado. Las filas exponen `data-selected` cuando están seleccionadas.

## Interacción con teclado

| Tecla       | Comportamiento                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Enter/Space | En un HeaderCell ordenable: alterna la dirección de orden (none → asc → desc → none).              |
| Tab         | Mueve el foco entre elementos interactivos (encabezados, checkboxes de fila si están habilitados). |

## Composición

Data Table está diseñado para componerse con otras primitivas. Usa `Checkbox` para selección de filas, `Pagination` debajo de la tabla para paginación, o `Combobox` en una barra de herramientas para filtrado de columnas. El patrón adaptador permite composición con motores de orden externos como TanStack Table.

## Renderizado SSR e hidratación

Data Table se renderiza como una tabla HTML estándar `<table>` durante SSR con todos los datos visibles en línea. El estado de orden y la visibilidad de columnas se determinan por props durante el renderizado en servidor. La hidratación adjunta manejadores de clic/teclado a los encabezados ordenables y checkboxes de selección sin re-renderizar el cuerpo de la tabla.
