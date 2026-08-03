---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toggle Group - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Toggle Group.
keywords: [toggle-group, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Toggle Group
productLayer: primitive
status: draft
package: "@solidiom/toggle-group"
primitive: toggle-group
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="toggle-group"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "c02bb420d165d5743e6d04fe0328f258a028a2b302e90965aef6adcfa1cad1c5"
translationStatus: draft
---
