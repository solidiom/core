---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tooltip - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Tooltip.
keywords: [tooltip, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="tooltip"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no keyboard interaction beyond native element defaults."
reviewStatus: draft
translationSourceHash: "cf07b830f3a595cb4fe507ebd94d77337941767e4efc35af046d3dc90511c7dc"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
