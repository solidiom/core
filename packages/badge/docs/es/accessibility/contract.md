---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Badge - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Badge.
keywords: [badge, accesibilidad, etiqueta, estado, lector-de-pantalla]
locale: es
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: accessibility
keyboard: []
focus: []
semantics:
  - "Se renderiza como un elemento `<span>`."
  - "Lleva los atributos `data-scope=\"badge\"` y `data-part=\"root\"`."
  - "Contiene contenido de texto presentacional proporcionado a través de `children`."
aria:
  - "El badge no añade roles o propiedades ARIA por defecto; se basa en su presentación visual como una etiqueta en línea."
  - "Los consumidores pueden añadir roles semánticos como `role=\"status\"` o `aria-label` dependiendo del contexto y el significado del contenido del badge."
consumerDuties:
  - "Proporcionar contenido de texto significativo a través de `children` que comunique el propósito del badge."
  - "Añadir `aria-label` o rol ARIA cuando el badge comunica información de estado en vivo o dinámica."
  - "Asegurar suficiente contraste de color entre el texto del badge y el fondo para la legibilidad."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Badge es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Badge es un elemento de presentación no interactivo y no recibe enfoque.
reviewStatus: draft
translationSourceHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
translationStatus: draft
---