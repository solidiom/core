---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Skeleton - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Skeleton.
keywords: [skeleton, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Skeleton
productLayer: primitive
status: draft
package: "@solidiom/skeleton"
primitive: skeleton
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="skeleton"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "3c8036c029df3f567bae83c047671da59993c2a2e2238b097faf277d07dd65a6"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
