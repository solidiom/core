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
translationSourceHash: "5e8dcda5bc0de5e1c3d61cbf13f1c65cef57513be948286d4dec83300159c7ca"
translationStatus: draft
---
