---
contentSchemaVersion: 1
title: Table
description: Tabla de datos estática sencilla con encabezado, cuerpo, filas y celdas.
keywords: [table, data table, header, body, row, cell, semantic]
locale: es
maturity: ga
product: Table
productLayer: primitive
status: draft
package: "@solidiom/table"
primitive: table
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "cd7e944f0f8b17f128a12bf2fed7a8a96133e95101d01d3c39834a4642de81c2"
translationStatus: "draft"
---

Table es un primitivo sencillo de tabla de datos estática (no interactiva) que renderiza elementos semánticos de tabla: `Root` es un `<table>`, `Header` un `<thead>`, `Body` un `<tbody>`, `Row` un `<tr>`, `Cell` un `<td>`, `HeaderCell` un `<th>` y `Caption` un `<caption>`.

## Uso

Compón `Root`, `Header`, `HeaderRow`, `HeaderCell`, `Body`, `Row`, `Cell` y `Caption` para renderizar una tabla semántica.

```tsx
import * as Table from "@solidiom/table"

;<Table.Root>
  <Table.Caption>Usuarios</Table.Caption>
  <Table.Header>
    <Table.HeaderRow>
      <Table.HeaderCell>Nombre</Table.HeaderCell>
      <Table.HeaderCell>Correo</Table.HeaderCell>
    </Table.HeaderRow>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ada</Table.Cell>
      <Table.Cell>ada@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/table`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

table expone 8 partes:

- **Root** — el elemento `<table>`.
- **Header** — el elemento `<thead>`.
- **HeaderRow** — una fila `<tr>` de encabezado.
- **HeaderCell** — una celda de encabezado `<th>`.
- **Body** — el elemento `<tbody>`.
- **Row** — una fila `<tr>` del cuerpo.
- **Cell** — una celda de datos `<td>`.
- **Caption** — el elemento `<caption>`.

## Estilos

table incluye `data-scope="table"` y atributos `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Coloca cualquier primitivo dentro de las celdas para renderizar contenido de tabla enriquecido; los elementos semánticos mantienen accesibles las marcas.

## SSR e hidratación

Table renderiza HTML estático y no requiere hidratación.
