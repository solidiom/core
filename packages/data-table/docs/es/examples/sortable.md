---
contentSchemaVersion: 1
title: Tabla ordenable
description: Una tabla de datos ordenable que demuestra el ordenamiento de columnas al hacer clic en los encabezados.
locale: es
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
translationSourceHash: "960b67818b203678be9b9659387bd62f11690c50635e850f97c0e9c80eb28eab"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El ejemplo en vivo muestra una tabla de lenguajes de programación que se puede ordenar por nombre, año o paradigma. Haz clic en cualquier encabezado de columna para alternar entre los estados ascendente, descendente y sin ordenar.

La interacción por teclado está completamente soportada: presiona <kbd>Tab</kbd> para mover el foco entre los encabezados ordenables y luego presiona <kbd>Enter</kbd> o <kbd>Espacio</kbd> para alternar la dirección de ordenamiento. La columna activa expone `aria-sort` con la dirección actual para que los lector de pantalla anuncien el cambio de estado.
