---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Virtual List - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Virtual List.
keywords: [virtual-list, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="virtual-list"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no keyboard interaction beyond native element defaults."
reviewStatus: draft
translationSourceHash: "ab6489014ba56a7e2207d879b4b210cc718b0d4cc8ad9b0e8f6218e0dad6b8b6"
translationStatus: draft
---
