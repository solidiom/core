---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Sheet - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Sheet.
keywords: [sheet, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Sheet
productLayer: primitive
status: draft
package: "@solidiom/sheet"
primitive: sheet
section: accessibility
keyboard:
  - key: Escape
    behavior: Cierra el panel y devuelve el foco al disparador.
  - key: Tab
    behavior: Mueve el foco dentro del contenido del panel (foco atrapado).
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="sheet"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "f36077194c07b55ef91ee6ea49dc5832234ed65c65d6eea7f2e7ef095f88e35a"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
