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
translationSourceHash: "477bedd3994af7f4d6aeb8125052d3a08e3c10e5893c034c9ab4a296cf352856"
translationStatus: draft
---
