---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Contrato de accesibilidad de Combobox
description: Responsabilidades de teclado, foco, semántica y consumidores para Combobox.
locale: es
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: accessibility
keyboard:
  - key: Enter
    behavior: Selecciona el elemento resaltado actualmente y cierra el listbox.
  - key: Escape
    behavior: Cierra el listbox sin seleccionar. El foco permanece en la entrada.
  - key: ArrowDown
    behavior: Abre el listbox si está cerrado, o mueve el resaltado al siguiente elemento.
  - key: ArrowUp
    behavior: Abre el listbox si está cerrado, o mueve el resaltado al elemento anterior.
  - key: Tab
    behavior: Cierra el listbox y mueve el foco al siguiente elemento enfocable.
focus:
  - La entrada mantiene el foco del DOM en todo momento mientras el listbox está abierto.
  - El patrón de descendiente activo resalta visualmente el elemento actual sin mover el foco.
  - El foco vuelve a la entrada después de que el listbox se cierra.
semantics:
  - Input tiene role combobox.
  - Input expone aria-autocomplete=list indicando que se presentan sugerencias.
  - Content tiene role listbox.
  - Cada elemento tiene role option.
aria:
  - Input expone aria-expanded reflejando el estado de apertura.
  - Input expone aria-controls apuntando al id del listbox.
  - Input expone aria-activedescendant apuntando al id del elemento resaltado.
  - Cada elemento expone aria-selected reflejando el estado de selección.
consumerDuties:
  - Proporciona una etiqueta accesible para la entrada mediante un elemento label visible o aria-label.
  - Comunica un estado vacío cuando ningún elemento coincide con el filtro actual.
  - Asegura que los valores de texto de los elementos sean únicos y descriptivos.
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "de89b67f6581c613ccbcc449b6e41ea365fbd5d4d81eb25a29323c8709d0ad17"
translationStatus: draft
---

## Evidencia automatizada

El resumen de evidencias siguiente se genera a partir del análisis axe ejecutable del repositorio para `@solidiom/combobox`. Solo registra comprobaciones automatizadas; no afirma conformidad completa.

## Verificación manual

Revisa la navegación por teclado, el resaltado por descendiente activo, la retención del foco en la entrada, el zoom/reflujo, los objetivos táctiles, el movimiento reducido, el contraste y los anuncios de lector de pantalla en el producto que lo consume. El diseño, las etiquetas y la lógica de filtrado de un consumidor pueden cambiar el resultado de accesibilidad.
