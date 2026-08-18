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
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos `data-scope="carousel"` y `data-part` en todas las partes.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "89b72423604d13ac80e3fcdc2cfa3cab4f52d1ae82f15f37546ba9cbbe55cf95"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
