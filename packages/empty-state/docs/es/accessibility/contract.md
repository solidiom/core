---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Empty State - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Empty State.
keywords: [empty-state, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="empty-state"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "bdf9206da67757d3c256228d83c616c32baf2338c28c0d5b2a27c49407203e9c"
translationStatus: draft
---
