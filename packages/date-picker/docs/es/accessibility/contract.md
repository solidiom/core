---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Date Picker - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Date Picker.
keywords: [date-picker, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="date-picker"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "ac14be14b3258b4fe32659dbe7f740bae02fd14db8321a7a5f455c88371f4543"
translationStatus: draft
---
