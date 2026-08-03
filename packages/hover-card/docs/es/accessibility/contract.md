---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Hover Card - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Hover Card.
keywords: [hover-card, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="hover-card"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "fcf76c324c123fffb2605a193fb2d60af4285693a1e55f00d251ca46c11a3873"
translationStatus: draft
---
