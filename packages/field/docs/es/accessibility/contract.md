---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Field - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Field.
keywords: [field, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Field
productLayer: primitive
status: draft
package: "@solidiom/field"
primitive: field
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="field"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "11134d19d09390e4e378175bd531fcd51635834f694f4aa21db53b00e04c24d3"
translationStatus: draft
---
