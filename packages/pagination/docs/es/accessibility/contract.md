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
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "91cc8f4ddfb68c34e93dca2f2f1635acab250afda69b99ead1d1f6697e546a6a"
translationStatus: draft
---
