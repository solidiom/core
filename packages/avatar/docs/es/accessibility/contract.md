---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Avatar - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Avatar.
keywords: [avatar, accesibilidad, imagen, reemplazo, lector-de-pantalla, alt]
locale: es
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renderiza `Root` como un `<span>` con `data-scope="avatar"` y `data-part="root"`.'
  - 'Renderiza `Image` como un `<img>` con `data-scope="avatar"` y `data-part="image"`. El atributo `alt` se pasa directamente para lectores de pantalla.'
  - 'Renderiza `Fallback` como un `<span>` con `data-scope="avatar"` y `data-part="fallback"`. Se oculta cuando la imagen se carga correctamente.'
aria:
  - "El prop `alt` en `Image` proporciona el nombre accesible para la imagen del avatar."
  - "Cuando la imagen está oculta durante la carga, el contenido de `Fallback` es visible para los lectores de pantalla."
  - "No se agregan roles ARIA más allá de la semántica nativa de `<img>` y `<span>`."
consumerDuties:
  - "Siempre proporciona un prop `alt` significativo en `Image` que describa la persona o entidad que representa el avatar."
  - "Proporciona contenido de reemplazo (iniciales, nombre, o icono) en `Fallback` para los casos en que la imagen no puede cargarse."
  - "Asegúrate de que el texto de reemplazo sea suficiente para identificar al usuario cuando la imagen no está disponible."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Avatar es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Avatar es un elemento de presentación no interactivo y no recibe enfoque.
reviewStatus: draft
translationSourceHash: "2f24c866ebf892ec31b5b9b74ae06f90a1e4a5a56825d54194d0f7e77d09c857"
translationStatus: draft
---
