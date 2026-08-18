---
contentSchemaVersion: 1
title: Button básico
description: Ejemplos de botón estándar, botón de icono, botón de alternancia y grupo de botones.
keywords: [button, clickeable, acción, carga, deshabilitado, icono, alternar, grupo]
locale: es
maturity: draft
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: examples
exampleId: button-basic
source:
  path: apps/site/src/components/ButtonExample.tsx
  export: ButtonExample
  language: tsx
runnable: true
translationSourceHash: "2c9474453b4c00c26b55bbf6cc0a21ada4b8fa71c35b9166c3558f2e3cf3430d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El ejemplo interactivo demuestra las cuatro partes de Button: un botón de acción estándar con estado de carga al hacer clic, un ToggleButton que mantiene estado presionado y un ButtonGroup. Presiona **Enter** o **Space** con el foco en cualquier botón para activarlo. El estado de carga deshabilita el botón y establece `aria-busy="true"` durante 1.2 segundos.

```tsx
import * as Button from "@solidiom/button"

;<Button.Root onClick={() => alert("clickeado")}>Haz clic</Button.Root>
```

## Con estado de carga

Usa el prop `loading` para indicar una acción en proceso. El botón se deshabilita automáticamente y se marca con `aria-busy="true"`.

```tsx
;<Button.Root loading>Guardando...</Button.Root>
```

## IconButton

Usa `IconButton` para botones solo con icono. Requiere `aria-label` para accesibilidad y envuelve el contenido del icono con `aria-hidden="true"`.

```tsx
;<Button.IconButton aria-label="Eliminar elemento">
  <TrashIcon />
</Button.IconButton>
```

## ToggleButton

Usa `ToggleButton` para acciones alternables como negrita o cursiva.

```tsx
import { createSignal } from "solid-js"

const ToggleExample = () => {
  const [pressed, setPressed] = createSignal(false)

  return (
    <Button.ToggleButton pressed={pressed()} onPressedChange={setPressed}>
      Negrita
    </Button.ToggleButton>
  )
}
```

## ButtonGroup

Usa `ButtonGroup` para agrupar visualmente botones relacionados.

```tsx
;<Button.ButtonGroup orientation="horizontal">
  <Button.Root>Borrador</Button.Root>
  <Button.Root>Vista previa</Button.Root>
  <Button.Root>Publicar</Button.Root>
</Button.ButtonGroup>
```
