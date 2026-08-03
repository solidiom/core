---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Context Menu - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Context Menu.
keywords: [context-menu, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Context Menu
productLayer: primitive
status: draft
package: "@solidiom/context-menu"
primitive: context-menu
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="context-menu"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "f223932a5ded39a67bc7a91d92679c76e054a5796577387820d1f93e35acc407"
translationStatus: draft
---
