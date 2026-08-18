---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Switch - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Switch.
keywords: [switch, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Switch
productLayer: primitive
status: draft
package: "@solidiom/switch"
primitive: switch
section: accessibility
keyboard:
  - key: Space
    behavior: Alterna el switch entre encendido y apagado.
  - key: Enter
    behavior: Alterna el switch entre encendido y apagado.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="switch"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "4b689ef4e49917d419c0cfb7204872ebe69d7db985f1fa0527907f1f0f802e5b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
