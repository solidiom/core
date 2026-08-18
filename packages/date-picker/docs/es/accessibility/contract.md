---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Date Picker - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Date Picker.
keywords: [date-picker, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="date-picker"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "1bcaeea7110ee295f167b78c4bb01c850e426f755c84e023dc6d71b64ad04861"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
