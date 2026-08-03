---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Button - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Button.
keywords: [button, accesibilidad, clickeable, teclado, enfoque, aria-busy, aria-pressed]
locale: es
maturity: draft
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: accessibility
keyboard:
  - key: Enter
    behavior: Activa el botón cuando tiene enfoque.
  - key: Space
    behavior: Activa el botón cuando tiene enfoque.
focus:
  - "Button.Root se renderiza como un elemento nativo `<button>` y recibe enfoque por defecto."
  - "Los botones deshabilitados y en carga se eliminan del orden de tabulación a través del atributo nativo `disabled`."
semantics:
  - 'Se renderiza como un elemento nativo `<button>` con `data-scope="button"` y `data-part="root"`.'
  - 'Cuando `loading` es true, establece `aria-busy="true"` y deshabilita el botón.'
  - 'ToggleButton se renderiza como un `<button>` con `aria-pressed` que refleja el estado presionado y `data-part="toggle"`.'
  - 'IconButton envuelve los hijos en `aria-hidden="true"` y requiere `aria-label` para el nombre accesible.'
  - 'ButtonGroup se renderiza como un `<div>` con `role="group"` y `data-part="group"`.'
  - "Lleva los atributos `data-disabled` y `data-loading` cuando los estados respectivos están activos."
aria:
  - '`aria-busy="true"` indica que el botón está en estado de carga.'
  - "`aria-pressed` en ToggleButton indica el estado actual de alternancia."
  - "`aria-label` en IconButton proporciona el nombre accesible para botones solo con icono."
  - '`role="group"` en ButtonGroup asocia botones relacionados.'
consumerDuties:
  - Asegurar que el texto del botón o `aria-label` comunique claramente la acción.
  - "Usar `IconButton` con un `aria-label` significativo cuando el botón no contiene texto visible."
  - "Usar `ToggleButton` para acciones que alternan entre dos estados, y gestionar el estado `pressed` externamente."
  - "Usar `ButtonGroup` para agrupar botones lógicamente relacionados con un contexto visual compartido."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "ca776d721613fa457c6a23236093d4127b7ff6e21851a6beca67ee04d0c1c264"
translationStatus: draft
---
