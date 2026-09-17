---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Textarea - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para Textarea.
keywords: [textarea, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: accessibility
keyboard:
  - key: "Teclado nativo del textarea"
    behavior: "Admite la edición y selección de texto mediante el teclado nativo, y Enter inserta un salto de línea para introducir texto multilínea."
focus:
  - "Root es un textarea nativo y recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva `data-scope="textarea"` y `data-part="root"` en el control nativo.'
  - "Conserva la semántica nativa de teclado, selección y formularios del textarea."
aria:
  - "Conserva los atributos ARIA del consumidor, incluidos los atributos de relación de Field.Control."
  - "El estado nativo/del componente controla el ARIA derivado; el ARIA entrante por sí solo no promueve el comportamiento nativo disabled, required o readonly."
consumerDuties:
  - "Proporciona una etiqueta visible o un nombre accesible como aria-label."
  - "Usa Field.Control cuando el control necesite relaciones reactivas de etiqueta, descripción o error."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "d504521ef34e199e3495f8872f93ac378f86139903875391cc5d6dbcd707267a"
translationStatus: draft
---
