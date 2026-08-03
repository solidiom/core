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
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "2502e1f31f64b554400a340e21226f4b2ad005a09dce75eb5296bd5d42a9278a"
translationStatus: draft
---
