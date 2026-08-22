---
contentSchemaVersion: 1
title: Table
description: Simple static data table with header, body, rows, and cells.
keywords: [table, data table, header, body, row, cell, semantic]
locale: en
maturity: ga
product: Table
productLayer: primitive
status: draft
package: "@solidiom/table"
primitive: table
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Table is a simple static (non-interactive) data table primitive that renders semantic table elements: `Root` is a `<table>`, `Header` a `<thead>`, `Body` a `<tbody>`, `Row` a `<tr>`, `Cell` a `<td>`, `HeaderCell` a `<th>`, and `Caption` a `<caption>`.

## Usage

Compose `Root`, `Header`, `HeaderRow`, `HeaderCell`, `Body`, `Row`, `Cell`, and `Caption` to render a semantic table.

```tsx
import * as Table from "@solidiom/table"

;<Table.Root>
  <Table.Caption>Users</Table.Caption>
  <Table.Header>
    <Table.HeaderRow>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
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

## Installation

Install the package with `pnpm add @solidiom/table`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

table exposes 8 parts:

- **Root** — the `<table>` element.
- **Header** — the `<thead>` element.
- **HeaderRow** — a header `<tr>` row.
- **HeaderCell** — a `<th>` header cell.
- **Body** — the `<tbody>` element.
- **Row** — a body `<tr>` row.
- **Cell** — a `<td>` data cell.
- **Caption** — the `<caption>` element.

## Styling

table carries `data-scope="table"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Place any primitives inside cells to render rich table content; the semantic elements keep the markup accessible.

## SSR and hydration

Table renders static HTML and requires no hydration.
