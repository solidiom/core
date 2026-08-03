---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Pagination - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Pagination.
keywords: [pagination, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Pagination
productLayer: primitive
status: draft
package: "@solidiom/pagination"
primitive: pagination
section: accessibility
keyboard:
  - key: Enter/Space
    behavior: Activa el botón de página enfocado.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="pagination"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "73860dced0d370fe7835a6fe56e6a397c3bde2fd3380474b53f1c579360a174b"
translationStatus: draft
---
