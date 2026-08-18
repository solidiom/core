---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Resizable Panels - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Resizable Panels.
keywords: [resizable-panels, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: accessibility
keyboard: []
focus:
  - "PanelGroup recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="resizable-panels"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "7710066fe971ec24b5ebb2fd66bd94785d221b361ca137e56e5109f6219e8086"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
