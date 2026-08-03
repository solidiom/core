---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Carousel - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Carousel.
keywords: [carousel, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Carousel
productLayer: primitive
status: draft
package: "@solidiom/carousel"
primitive: carousel
section: accessibility
keyboard: []
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="carousel"` y `data-part` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "83d38a7afe7b38518747405f10170a6e1cd3ce9629f43c791dfd4107a72eff0a"
translationStatus: draft
---
