---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Command Palette - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Command Palette.
keywords: [command-palette, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Command Palette
productLayer: primitive
status: draft
package: "@solidiom/command-palette"
primitive: command-palette
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="command-palette"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "dbfa77ea1d874b0c3392c6a657e3663bbe11bb748158e12f14ad5b41b09eafa5"
translationStatus: draft
---
