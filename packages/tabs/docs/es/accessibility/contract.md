---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tabs - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Tabs.
keywords: [tabs, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Tabs
productLayer: primitive
status: draft
package: "@solidiom/tabs"
primitive: tabs
section: accessibility
keyboard:
  - key: ArrowRight
    behavior: Mueve el foco al siguiente disparador de pestaña.
  - key: ArrowLeft
    behavior: Mueve el foco al disparador de pestaña anterior.
  - key: Home
    behavior: Mueve el foco al primer disparador de pestaña.
  - key: End
    behavior: Mueve el foco al último disparador de pestaña.
  - key: Enter/Space
    behavior: Activa la pestaña enfocada (en modo de activación manual).
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="tabs"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "8bd61d6faccffd0fb66443545bfbc86fc7bfb5c9493c1179ad7b61cbee356d0f"
translationStatus: draft
---
