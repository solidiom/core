---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Calendar - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Calendar.
keywords: [calendar, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Calendar
productLayer: primitive
status: draft
package: "@solidiom/calendar"
primitive: calendar
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="calendar"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "7e6715e86b4bce175dc9d539c37e02ac79e17917202bcdc9e2e5bd5600534fb6"
translationStatus: draft
---
