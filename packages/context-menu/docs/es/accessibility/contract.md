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
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="context-menu"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "34183bcac45ea039c461d9103c2a9125ee3be90d58182c8aca4f551005bb682f"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
