---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Sheet - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Sheet.
keywords: [sheet, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Sheet
productLayer: primitive
status: draft
package: "@solidiom/sheet"
primitive: sheet
section: accessibility
keyboard:
  - key: Escape
    behavior: Cierra el panel y devuelve el foco al disparador.
  - key: Tab
    behavior: Mueve el foco dentro del contenido del panel (foco atrapado).
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="sheet"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "fb42e722fd6270e9eab242670cf045ef938275717e47ca9c64f967e21c09bae6"
translationStatus: draft
---
