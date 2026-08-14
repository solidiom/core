---
contentSchemaVersion: 1
title: Diálogo básico
description: Componente de diálogo con disparador, título, descripción y contenido.
keywords: [dialog, modal, overlay, popup]
locale: es
maturity: draft
product: Dialog
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "dialog"
section: examples
exampleId: dialog-component-basic
source:
  path: apps/site/src/components/DialogExample.tsx
  export: DialogExample
  language: tsx
runnable: true
translationSourceHash: "2821a69275709d9eac694e49ab89b9a0e56eceaf13132cfd4d70946ace29df39"
translationStatus: draft
---

El componente Dialog es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/dialog`. Añade composición, slots de estilo semántico y estado de apertura controlado mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { createSignal } from "solid-js"
import { StyledDialog } from "@solidiom/recipes-css"

export function DialogExample() {
  const [open, setOpen] = createSignal(false)

  return (
    <StyledDialog
      trigger={<button class="solidiom-btn">Open Dialog</button>}
      title="Confirm action"
      description="Are you sure you want to continue?"
      open={open}
      onOpenChange={setOpen}
    >
      <div class="flex justify-end gap-2 mt-4">
        <button class="solidiom-btn solidiom-btn--variant-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button class="solidiom-btn solidiom-btn--variant-primary" onClick={() => setOpen(false)}>
          Confirm
        </button>
      </div>
    </StyledDialog>
  )
}
```

## Estado de apertura controlado

Usa `createSignal` para gestionar el estado de apertura del diálogo. Pasa el getter de la señal como `open` y el setter como `onOpenChange` para habilitar el comportamiento controlado de apertura/cierre.

## Área de contenido

La propiedad `children` se renderiza dentro del área de contenido del diálogo, debajo del título y la descripción. Úsala para agregar formularios, botones de confirmación o cualquier contenido personalizado.
