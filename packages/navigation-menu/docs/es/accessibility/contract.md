---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Navigation Menu - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Navigation Menu.
keywords: [navigation-menu, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Navigation Menu
productLayer: primitive
status: draft
package: "@solidiom/navigation-menu"
primitive: navigation-menu
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Abre el contenido desplegable cuando el foco está en un disparador.
  - key: Escape
    behavior: Cierra el contenido desplegable.
  - key: Tab
    behavior: Mueve el foco al siguiente elemento enfocable en la navegación.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="navigation-menu"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "33d3349bc2272c50bd01bf0fa63cd569353fcf249cf7c2d7e2f77bf1fd7297ce"
translationStatus: draft
---
