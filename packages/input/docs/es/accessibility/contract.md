---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Input - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Input.
keywords: [input, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="input"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "ea771e04bcb3bfdead9d013cad0cb7a981d30bee68fa778d7bc1f9023b90372b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
