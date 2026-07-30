---
contentSchemaVersion: 1
title: Sortable table
description: A sortable data table that demonstrates column sorting by clicking headers.
locale: en
maturity: beta
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: examples
exampleId: data-table-sortable
source:
  path: apps/site/src/components/DataTableExample.tsx
  export: DataTableExample
  language: tsx
runnable: true
---

The live example displays a table of programming languages that can be sorted by name, year, or paradigm. Click any column header to cycle through ascending, descending, and unsorted states.

Keyboard interaction is fully supported: press <kbd>Tab</kbd> to move focus between sortable headers, then press <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle sort direction. The active sort column exposes `aria-sort` with the current direction so screen readers announce the state change.
