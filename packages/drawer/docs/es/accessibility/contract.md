---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Drawer - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Drawer.
keywords: [drawer, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="drawer"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "10f72a5e8b373a18115939beee64de3d2497e23048ab01f253c10f6139887fb1"
translationStatus: draft
---
