---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Empty State - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Empty State.
keywords: [empty-state, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="empty-state"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "aac5a5e807d0ed6fb5421903eeefce1ba5433c39651f1822c65837da418a9130"
translationStatus: draft
---
