---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Breadcrumb - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Breadcrumb.
keywords: [breadcrumb, accesibilidad, navegación, lector-de-pantalla, aria-label, aria-current]
locale: es
maturity: draft
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: accessibility
keyboard: []
focus: []
semantics:
  - "Renderiza la raíz como un elemento `<nav>` con `aria-label=\"Breadcrumb\"`."
  - "Renderiza los elementos dentro de una estructura de lista `<ol>` para un ordenamiento semántico adecuado."
  - "Cada entrada del breadcrumb es un `<li>` que contiene un enlace de navegación."
  - "El enlace de la página actual lleva `aria-current=\"page\"` para indicar la ubicación activa."
  - "Separator y Ellipsis se renderizan con `role=\"presentation\"` y `aria-hidden=\"true\"` (Separator) para ocultar el contenido decorativo del árbol de accesibilidad."
  - "Lleva los atributos `data-scope=\"breadcrumb\"` y `data-part` en todas las partes."
aria:
  - "`aria-label=\"Breadcrumb\"` en el `<nav>` identifica la región de navegación para los lectores de pantalla."
  - "`aria-current=\"page\"` en el enlace de la página actual indica la ubicación presente del usuario en la jerarquía."
  - "`role=\"presentation\"` en Separator y Ellipsis elimina los elementos decorativos del árbol de accesibilidad."
  - "`aria-hidden=\"true\"` en Separator asegura que el divisor visual no sea anunciado."
consumerDuties:
  - Usar Breadcrumb para representar la ubicación actual del usuario dentro de una jerarquía de navegación.
  - "Establecer `current` en el `Link` que corresponde a la página actual."
  - "Usar `Ellipsis` para indicar niveles intermedios omitidos en jerarquías profundamente anidadas."
  - "Asegurar que todos los elementos `Link` tengan contenido de texto significativo para los usuarios de lectores de pantalla."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Breadcrumb se basa en las interacciones de teclado estándar de los elementos de ancla (Tab/Enter/Space); no se requiere manejo de teclado personalizado.
  - criterion: focus
    rationale: Breadcrumb se basa en la gestión de enfoque estándar de los elementos de ancla; no se requiere manejo de enfoque personalizado.
reviewStatus: draft
translationSourceHash: "70bab8c21e5b65661269a5eacd4bea15cb9aeb16e6dbf18a8d7d1138e4c8d7e0"
translationStatus: draft
---