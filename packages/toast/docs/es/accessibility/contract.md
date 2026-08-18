---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toast - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Toast.
keywords: [toast, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: accessibility
keyboard: []
focus:
  - "Region recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="toast"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no keyboard interaction beyond native element defaults."
reviewStatus: draft
translationSourceHash: "786194ebe752f9c8dbd2fc1d80e5c9ec6c389c6d48aab81968574fd7b2a67a03"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
