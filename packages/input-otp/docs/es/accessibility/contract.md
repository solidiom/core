---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Input OTP - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Input OTP.
keywords: [input-otp, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Input OTP
productLayer: primitive
status: draft
package: "@solidiom/input-otp"
primitive: input-otp
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="input-otp"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "e0fc164b25576e0c1d62fd86a78b5ae00a8d48f3f6da15786a8cbabfca831543"
translationStatus: draft
---
