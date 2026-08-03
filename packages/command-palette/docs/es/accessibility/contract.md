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
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="command-palette"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "faba18c04da67d976442756cdd53196ab207863c8b17271d505202e3d17097e0"
translationStatus: draft
---
