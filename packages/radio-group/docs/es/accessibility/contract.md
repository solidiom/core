---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Radio Group - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Radio Group.
keywords: [radio-group, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Radio Group
productLayer: primitive
status: draft
package: "@solidiom/radio-group"
primitive: radio-group
section: accessibility
keyboard:
  - key: ArrowDown/ArrowRight
    behavior: Mueve la selección al siguiente elemento radio.
  - key: ArrowUp/ArrowLeft
    behavior: Mueve la selección al elemento radio anterior.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="radio-group"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "e7db21f030b39068bbc4557e69bd4b049ec5c63cd277ce60c77e6487907cf606"
translationStatus: draft
---
