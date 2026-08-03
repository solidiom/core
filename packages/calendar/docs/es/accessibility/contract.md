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
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
translationSourceHash: "7cc8793a1987e2794afd8f7a23f351e6cd01d56ba433c723df1794fb6af214d4"
translationStatus: draft
---
