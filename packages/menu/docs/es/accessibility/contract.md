---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Menu - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Menu.
keywords: [menu, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Menu
productLayer: primitive
status: draft
package: "@solidiom/menu"
primitive: menu
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Mueve el foco al siguiente elemento del menú.
  - key: ArrowUp
    behavior: Mueve el foco al elemento anterior del menú.
  - key: Enter/Space
    behavior: Activa el elemento de menú enfocado.
  - key: Escape
    behavior: Cierra el menú y devuelve el foco al disparador.
  - key: ArrowRight
    behavior: Abre un sub-menú cuando el foco está en un sub-disparador.
  - key: ArrowLeft
    behavior: Cierra el sub-menú y devuelve el foco al padre.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="menu"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "b8d2dfb1772042f4c30cda9bbef00f790780305af9a45c15e7aaeee4ca3f410d"
translationStatus: draft
---
