---
contentSchemaVersion: 1
title: Menú desplegable básico
description: Componente de menú desplegable con botón de activación y elementos del menú.
keywords: [menu, dropdown, context, navigation]
locale: es
maturity: draft
product: Dropdown Menu
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "menu"
section: examples
exampleId: menu-component-basic
source:
  path: apps/site/src/components/MenuExample.tsx
  export: MenuExample
  language: tsx
runnable: true
translationSourceHash: "bb4d5a8c7d204a7bd49514174862a7c17a6ca783a0f2c0c8f95d8f9a8b7cb70d"
translationStatus: draft
---

El componente Dropdown Menu es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/menu`. Añade composición y slots de estilo semántico mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledMenu } from "@solidiom/recipes-css"

export function MenuExample() {
  return (
    <StyledMenu trigger={<button class="solidiom-btn">Actions</button>}>
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Edit")}>
        Edit
      </div>
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Duplicate")}>
        Duplicate
      </div>
      <hr />
      <div role="menuitem" tabindex="-1" onClick={() => console.log("Delete")}>
        Delete
      </div>
    </StyledMenu>
  )
}
```

## Elementos del menú

Cada hijo de `StyledMenu` se renderiza como un elemento del menú. Usa manejadores `onClick` u `onSelect` para responder a la selección del usuario.

## Separadores

Usa `<hr />` entre elementos del menú para agrupar visualmente acciones relacionadas.
