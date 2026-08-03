---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Spinner - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Spinner.
keywords: [spinner, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Spinner
productLayer: primitive
status: draft
package: "@solidiom/spinner"
primitive: spinner
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="spinner"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "303553b137c1c0102b6d21981138609257807ebecb4da0a5236c21a23669d0e8"
translationStatus: draft
---
