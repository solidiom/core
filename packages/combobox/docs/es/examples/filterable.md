---
contentSchemaVersion: 1
title: Combobox filtrable
description: Una lista de frutas filtrable que demuestra la composición completa de Combobox con navegación por teclado.
locale: es
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: examples
exampleId: combobox-filterable
source:
  path: apps/site/src/components/ComboboxExample.tsx
  export: ComboboxExample
  language: tsx
runnable: true
translationSourceHash: "553c4b4c8f6a47c5daba15a95e8ff2f4a4e936cb1c05fd82e4d977b23658ff30"
translationStatus: draft
---

El ejemplo en vivo filtra una lista de frutas mientras escribes. Usa <kbd>ArrowDown</kbd> y <kbd>ArrowUp</kbd> para navegar entre elementos, <kbd>Enter</kbd> para seleccionar el elemento resaltado y <kbd>Escape</kbd> para cerrar el listbox. La entrada mantiene el foco durante toda la interacción usando el patrón de descendiente activo.

La lógica de filtrado se ejecuta en el consumidor, no dentro del primitivo. Esto mantiene a Combobox agnóstico respecto a la estrategia de coincidencia, permitiendo a los consumidores implementar búsqueda difusa, por subcadena o del lado del servidor.
