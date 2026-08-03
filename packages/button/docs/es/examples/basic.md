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
  path: packages/button/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "48dc5167d8a3b8ba9ab52613041300c363d3cfeebd28041f5190906f9467c623"
translationStatus: draft
---

```tsx
import * as Button from "@solidiom/button"

;<Button.Root onClick={() => alert("clickeado")}>Haz clic</Button.Root>
```

## Con estado de carga

Usa el prop `loading` para indicar una acción en proceso. El botón se deshabilita automáticamente y se marca con `aria-busy="true"`.

```tsx
;<Button.Root loading>
  Guardando...
</Button.Root>
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