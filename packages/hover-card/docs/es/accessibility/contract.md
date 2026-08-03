---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Hover Card - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Hover Card.
keywords: [hover-card, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="hover-card"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no keyboard interaction beyond native element defaults."
reviewStatus: draft
translationSourceHash: "12490fe426921baa0a939ba8f8c1eda0f0c65818691ee16cf6bade8ea3741f4c"
translationStatus: draft
---
