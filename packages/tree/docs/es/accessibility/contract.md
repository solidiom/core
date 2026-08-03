---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tree - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Tree.
keywords: [tree, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="tree"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "c4adc29263552b311caa63e98b1085131f6a458d9ff27f54589becad3c0a0656"
translationStatus: draft
---
