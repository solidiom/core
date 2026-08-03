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
translationSourceHash: "a7ee15de707d661617bfa8ef9aa909982410faea474ef28ffc8dceb2d8fa0c9a"
translationStatus: draft
---
