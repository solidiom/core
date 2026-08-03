---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toast - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Toast.
keywords: [toast, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: accessibility
keyboard: []
focus:
  - "Region recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="toast"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "73287f01e02b73842081109c4885809ed284e5800739ef25a0bcd5f324cf4afe"
translationStatus: draft
---
