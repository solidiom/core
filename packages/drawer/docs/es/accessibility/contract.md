---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Drawer - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Drawer.
keywords: [drawer, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="drawer"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "038e0df247d13a4cea4becc9be3494419a22202a5fd48e42225001a3ff831e41"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
