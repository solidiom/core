---
contentSchemaVersion: 1
title: Botón básico
description: Botón estándar, botón de icono, botón de alternancia y grupo de botones con estilos de receta.
keywords: [button, component, styled, recipe, variants]
locale: es
maturity: draft
product: Button
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "button"
section: examples
exampleId: button-component-basic
source:
  path: apps/site/src/components/ButtonComponentExample.tsx
  export: ButtonComponentExample
  language: tsx
runnable: true
translationSourceHash: "ab351d0a5af96edb3fb458266b7c1f31e1099e6016531ae65ee8aae9f83922c3"
translationStatus: draft
---

El componente Button es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/button`. Añade estilos de variante, composición y slots de estilo semántico mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button variant="default" size="md">
  Click me
</Button>
```

## Con variantes

El componente soporta las mismas variantes que el primitivo, con estilos aplicados a través de la capa de receta.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button variant="destructive" size="sm">
  Delete
</Button>
;<Button variant="outline" size="lg">
  Cancel
</Button>
;<Button variant="ghost">Secondary</Button>
;<Button variant="link">Learn more</Button>
```

## IconButton

Usa `IconButton` para acciones solo con icono con tamaño consistente.

```tsx
import { IconButton } from "@solidiom/recipes-css"

;<IconButton aria-label="Cerrar" variant="ghost">
  <CloseIcon />
</IconButton>
```

## ToggleButton

Usa `ToggleButton` para acciones alternables con estados presionados estilizados.

```tsx
import { ToggleButton } from "@solidiom/recipes-css"
import { createSignal } from "solid-js"

const ToggleExample = () => {
  const [pressed, setPressed] = createSignal(false)

  return (
    <ToggleButton pressed={pressed()} onPressedChange={setPressed}>
      Bold
    </ToggleButton>
  )
}
```

## ButtonGroup

Usa `ButtonGroup` para agrupar visualmente acciones relacionadas.

```tsx
import { Button, ButtonGroup } from "@solidiom/recipes-css"

;<ButtonGroup orientation="horizontal">
  <Button variant="outline">Draft</Button>
  <Button variant="outline">Preview</Button>
  <Button>Publish</Button>
</ButtonGroup>
```
