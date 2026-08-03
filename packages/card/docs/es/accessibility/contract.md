---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Card - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Card.
keywords: [card, accesibilidad, contenedor, lector-de-pantalla, html-semantico]
locale: es
maturity: draft
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renderiza `Root`, `Header`, `Content` y `Footer` como elementos `<div>` con `data-scope="card"` y los atributos `data-part` correspondientes.'
  - "Renderiza `Title` como un elemento de encabezado `<h3>`, proporcionando estructura de esquema del documento."
  - "Renderiza `Description` como un elemento de párrafo `<p>`."
  - 'Todas las partes llevan los atributos `data-scope="card"` y `data-part="*"` para identificación.'
aria: []
consumerDuties:
  - "Usar Card para agrupar contenido y acciones lógicamente relacionados."
  - "Asegurarse de que el texto de `Title` sea descriptivo y significativo para los usuarios de lectores de pantalla."
  - "Si la card envuelve un enlace o botón, aplicar roles ARIA apropiados o HTML semántico al elemento interactivo dentro de `Content`."
  - "No anidar elementos interactivos directamente en `Root`; colocarlos dentro de `Content` o `Footer`."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Card es un elemento contenedor no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Card es un elemento contenedor no interactivo y no recibe enfoque.
  - criterion: aria
    rationale: Card se basa en elementos HTML semánticos (h3, p) para accesibilidad y no requiere atributos ARIA adicionales.
reviewStatus: draft
translationSourceHash: "48834d3f5c6dfb423999d58280ff967053dbc742044592ce68353897302dfe38"
translationStatus: draft
---
