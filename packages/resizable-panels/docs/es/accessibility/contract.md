---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Resizable Panels - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Resizable Panels.
keywords: [resizable-panels, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: accessibility
keyboard: []
focus:
  - "PanelGroup recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="resizable-panels"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "26c0b22639ba31fa7c9ff2a125f918fa6d862e68f78f903535f8f8a58e7fd0aa"
translationStatus: draft
---
