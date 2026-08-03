---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toolbar - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Toolbar.
keywords: [toolbar, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Toolbar
productLayer: primitive
status: draft
package: "@solidiom/toolbar"
primitive: toolbar
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="toolbar"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "d8ebf7f887d70807f8fa66d3784a1f6b574066d3d7c0e10dd810ec80d4af9f64"
translationStatus: draft
---
