---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Select - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Select.
keywords: [select, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Select
productLayer: primitive
status: draft
package: "@solidiom/select"
primitive: select
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Abre la lista si está cerrada; mueve el resaltado a la siguiente opción.
  - key: ArrowUp
    behavior: Mueve el resaltado a la opción anterior.
  - key: Enter
    behavior: Selecciona la opción resaltada y cierra la lista.
  - key: Escape
    behavior: Cierra la lista sin cambiar la selección.
  - key: Space
    behavior: Abre la lista o selecciona la opción resaltada.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="select"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "1c62f1befc980e257a106162c49cab975e80f370d07fe85a7334e5b8c344f1db"
translationStatus: draft
---
