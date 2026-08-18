---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Meter - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Meter.
keywords: [meter, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Meter
productLayer: primitive
status: draft
package: "@solidiom/meter"
primitive: meter
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="meter"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "f46e66b595cb0d7c2b661105ae0baa6cc26deb8e6ee9c8c7b6f2b5d5613b9ce1"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
