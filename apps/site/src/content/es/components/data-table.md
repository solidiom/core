---
contentSchemaVersion: 1
title: Tabla de Datos
description: Componente de tabla de datos estilizado — el envoltorio de receta para los perfiles css, tailwind, unocss usando el primitivo data-table.
keywords: [data-table, table, sortable, component, css, tailwind, unocss]
locale: es
maturity: draft
product: Data Table
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "data-table"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "ffa84b8b7a7cb050b8ef1600f8dd83bcec2498b1eebac5e12db381482bd6289b"
translationStatus: draft
---

Componente de tabla de datos estilizado — el envoltorio de receta para los perfiles css, tailwind, unocss usando el primitivo data-table.

## Uso

El componente Data Table es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/data-table`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

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
      <DataTable.HeaderCell columnId="name">Nombre</DataTable.HeaderCell>
      <DataTable.HeaderCell columnId="email">Email</DataTable.HeaderCell>
    </tr>
  </DataTable.Header>
  <DataTable.Body>
    {/* Renderizado de filas por el consumidor */}
  </DataTable.Body>
</StyledDataTable>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/data-table` correspondiente como dependencia par.

## Anatomía

El componente Data Table envuelve el primitivo `@solidiom/data-table`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento `<table>` envoltorio que aplica estilos de receta y delega al primitivo.
- **Header** — la sección `<thead>`.
- **HeaderCell** — las celdas `<th>` con soporte de ordenamiento.
- **Body** — la sección `<tbody>`.
- **Row** — los elementos `<tr>` con soporte de selección.
- **Cell** — las celdas de datos `<td>`.

## Variantes y estados

Data Table hereda su soporte de variantes y estados de `@solidiom/data-table`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Data Table está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-data-table` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Data Table se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Data Table delega la accesibilidad a `@solidiom/data-table`. Consulta el [contrato de accesibilidad del primitivo Data Table](/primitives/data-table/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.