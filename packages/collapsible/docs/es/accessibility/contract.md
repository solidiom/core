---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Collapsible - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Collapsible.
keywords: [collapsible, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Collapsible
productLayer: primitive
status: draft
package: "@solidiom/collapsible"
primitive: collapsible
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="collapsible"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "378318d33209f779900d1b53d2682601b21627e5c0c94c7b6cc567d538606de9"
translationStatus: draft
---
