---
contentSchemaVersion: 1
title: Diálogo de confirmación
description: Una confirmación de acción destructiva que demuestra la composición completa de Dialog.
locale: es
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: examples
exampleId: dialog-confirmation
source:
  path: apps/site/src/components/DialogExample.tsx
  export: DialogExample
  language: tsx
runnable: true
---

El ejemplo en vivo usa una acción de confirmación porque necesita un título claro, una explicación de la consecuencia y una forma explícita de cerrarlo. Presiona <kbd>Escape</kbd>, selecciona **Cancelar** o selecciona **Eliminar espacio de trabajo** para cerrarlo. No se modifica ningún dato.

El activador recupera el foco tras el cierre. El aspecto visual hereda los tokens semánticos claros y oscuros del sitio, en lugar de incluir valores de tema en el ejemplo.
