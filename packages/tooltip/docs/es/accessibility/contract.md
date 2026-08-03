---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tooltip - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Tooltip.
keywords: [tooltip, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="tooltip"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "e604fbf578d67a016e2f0ebf271e82f446d432af26730e1a5f813596f1cab4b8"
translationStatus: draft
---
