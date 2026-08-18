---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tree - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Tree.
keywords: [tree, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="tree"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "055ca81424d29faf01d217ed9bff0ebfbb0dd550194339cc8e20402e03e91be2"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
