---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Scroll Area - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Scroll Area.
keywords: [scroll-area, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Scroll Area
productLayer: primitive
status: draft
package: "@solidiom/scroll-area"
primitive: scroll-area
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="scroll-area"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "fb28ebc03be0094a44b8a7807acc77a524e282c2f5c77190c928dacf8b7f1e79"
translationStatus: draft
---
