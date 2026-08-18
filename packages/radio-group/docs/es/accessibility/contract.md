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
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "6c74340a3aeeb811008562f2341a9444b300b1097595d8e710299f623e7c15d1"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
