---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Input - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Input.
keywords: [input, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="input"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "14d635d3048a0ce32076c4cb4c8f44cf5d73476a3398692aa02ebd51670092b5"
translationStatus: draft
---
