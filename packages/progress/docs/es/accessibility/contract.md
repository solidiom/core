---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Progress - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Progress.
keywords: [progress, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Progress
productLayer: primitive
status: draft
package: "@solidiom/progress"
primitive: progress
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="progress"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "35940f03fd7b2350b18733bdcd594171c1b14b341e5912e9653b8c2ce717b9d5"
translationStatus: draft
---
