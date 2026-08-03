---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Popover - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Popover.
keywords: [popover, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Popover
productLayer: primitive
status: draft
package: "@solidiom/popover"
primitive: popover
section: accessibility
keyboard:
  - key: Escape
    behavior: Cierra el popover y devuelve el foco al disparador.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="popover"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "22e8fdba33d7c66d211722ca75178255041e6ca10d9a0bf8fd050f59abd49045"
translationStatus: draft
---
