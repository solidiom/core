---
contentSchemaVersion: 1
title: Dialog
description: Presenta contenido modal o no modal que requiere una interacción enfocada.
keywords: [modal, superposición, foco]
locale: es
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: overview
---

Dialog presenta contenido contextual sobre la página actual. Úsalo cuando una decisión enfocada o un flujo breve deba interrumpir la tarea actual.

## Uso

Compón `Root`, `Trigger`, `Portal`, `Backdrop` y `Content`. Un diálogo modal debe incluir `Title` y una `Description` concisa para que la tecnología de asistencia pueda anunciar su propósito.

```tsx
import * as Dialog from "@solidiom/dialog"

;<Dialog.Root>
  <Dialog.Trigger>Abrir diálogo</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Content>
      <Dialog.Title>Título del diálogo</Dialog.Title>
      <Dialog.Description>Explica la decisión o el siguiente paso.</Dialog.Description>
      <Dialog.Close>Cerrar</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Usa `modal={false}` solo cuando sea apropiado mantener la interacción con el fondo. No uses un Dialog para información que pertenezca al flujo normal del documento.

## Instalación

Instala el paquete con `pnpm add @solidiom/dialog`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.
