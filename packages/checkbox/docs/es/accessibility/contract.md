---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Checkbox - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Checkbox.
keywords: [checkbox, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Checkbox
productLayer: primitive
status: draft
package: "@solidiom/checkbox"
primitive: checkbox
section: accessibility
keyboard:
  - key: Space
    behavior: Alterna el checkbox entre marcado y desmarcado.
focus:
  - "Group recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="checkbox"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "3e626f7f2f3aba950438d306204bda4e92ecb4aa34feca7e1b06f4833cc13532"
translationStatus: draft
---
