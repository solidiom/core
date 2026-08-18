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
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="slider"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "3c21c8f59eb791dcd7eb7b0536c40a1d7860a2931fa3bb6c2d3f7f18f3e7aa16"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
