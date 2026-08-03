---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Listbox - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Listbox.
keywords: [listbox, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Listbox
productLayer: primitive
status: draft
package: "@solidiom/listbox"
primitive: listbox
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="listbox"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "982cc07ec7e51db0e90ae8964b4d42fb9d0a419c689e0db9ce8d64453085a2bb"
translationStatus: draft
---
