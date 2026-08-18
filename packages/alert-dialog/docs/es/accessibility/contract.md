---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Alert Dialog - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Alert Dialog.
keywords: [alert-dialog, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="alert-dialog"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "681bf5443add6eecf6dab09b0c14f92f423cee25de9dcf2f4bd55b1f6e0f356b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
