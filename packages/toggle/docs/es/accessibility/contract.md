---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toggle - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Toggle.
keywords: [toggle, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Toggle
productLayer: primitive
status: draft
package: "@solidiom/toggle"
primitive: toggle
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="toggle"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "1f21cdcc9b4fc6d1a6ada788897c35b641a685e7ecb7427fbb94886e79fdb968"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
