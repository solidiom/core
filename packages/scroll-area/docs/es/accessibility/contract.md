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
translationSourceHash: "7fd094a6639ee325c525533844229e04656169d06c190803208b8b85c0af40be"
translationStatus: draft
---
