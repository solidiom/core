---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Slider - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Slider.
keywords: [slider, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Slider
productLayer: primitive
status: draft
package: "@solidiom/slider"
primitive: slider
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="slider"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "072e52e3003a82e48576f210ca3e963a9c86b632ea71af069086a9d9ce79254d"
translationStatus: draft
---
