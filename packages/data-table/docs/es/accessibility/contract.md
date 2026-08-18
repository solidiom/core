---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Contrato de accesibilidad de Data Table
description: Responsabilidades de teclado, foco, semántica y consumidores para Data Table.
locale: es
maturity: beta
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: accessibility
keyboard:
  - key: Enter o Espacio
    behavior: Alterna la dirección de ordenamiento en la celda de encabezado ordenable enfocada (cicla ascendente, descendente, ninguno).
  - key: Tab
    behavior: Navega el foco entre las celdas de encabezado ordenables.
focus:
  - Las celdas de encabezado ordenables son enfocables mediante tabindex=0.
  - Las celdas de encabezado no ordenables no reciben foco mediante Tab.
semantics:
  - Usa elementos nativos table, thead, th, tbody, tr y td para una semántica de tabla adecuada.
  - aria-sort se aplica al encabezado de la columna actualmente ordenada con valor ascending o descending.
aria:
  - aria-sort ascending en el encabezado activo cuando se ordena de forma ascendente.
  - aria-sort descending en el encabezado activo cuando se ordena de forma descendente.
  - aria-selected en las filas cuando el modo de selección de filas está habilitado (single o multiple).
consumerDuties:
  - Proporcionar encabezados de columna significativos que describan los datos en cada columna.
  - Asegurar que los datos de las filas sean accesibles y no dependan solo de indicaciones visuales.
  - Manejar estados vacíos y de carga con mensajes apropiados para tecnología de asistencia.
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "cbfa39ea9964cc1fdf9f4a9ff88ae8c3569738204a96c05221885e941436582b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

## Evidencia automatizada

El resumen de evidencias siguiente se genera a partir del análisis axe ejecutable del repositorio para `@solidiom/data-table`. Solo registra comprobaciones automatizadas; no afirma conformidad completa.

## Verificación manual

Revisa la alternancia de ordenamiento por teclado, el movimiento del foco entre encabezados, el zoom/reflujo, los objetivos táctiles, el movimiento reducido, el contraste y los anuncios de lector de pantalla en el producto que lo consume. El diseño, las etiquetas y el flujo de un consumidor pueden cambiar el resultado de accesibilidad.
