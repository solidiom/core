---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Alert Dialog - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Alert Dialog.
keywords: [alert-dialog, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="alert-dialog"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "6a6141346b118e61dae63cc9f3d016de774970cf654f816b68497907154e1ba5"
translationStatus: draft
---
