---
contentSchemaVersion: 1
title: Botón básico
description: Botón estándar, botón de alternancia y grupo de botones usando la primitiva con estilos de receta.
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
  path: apps/site/src/components/ButtonExample.tsx
  export: ButtonExample
  language: tsx
runnable: true
translationSourceHash: "d44359aa8813d74d65990e7c54076725832aeef75d91561938fb4fdb7564ae42"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El ejemplo ejecutable usa la primitiva `@solidiom/button` y la hoja de estilos de receta CSS. El paquete de recetas exporta `StyledButton`; no exporta `Button`, `IconButton`, `ToggleButton` ni `ButtonGroup` con esos nombres.

```tsx
import * as Button from "@solidiom/button"
import "@solidiom/recipes-css/styles/button.css"

;<Button.Root loading={false}>Haz clic</Button.Root>
```

## Botón de alternancia

`ToggleButton` es exportado por la primitiva de botones:

```tsx
import * as Button from "@solidiom/button"

;<Button.ToggleButton pressed={false} onPressedChange={() => undefined}>
  Negrita
</Button.ToggleButton>
```

## Grupo de botones

`ButtonGroup` también es exportado por la primitiva de botones:

```tsx
import * as Button from "@solidiom/button"

;<Button.ButtonGroup orientation="horizontal">
  <Button.Root>Borrador</Button.Root>
  <Button.Root>Vista previa</Button.Root>
  <Button.Root>Publicar</Button.Root>
</Button.ButtonGroup>
```
