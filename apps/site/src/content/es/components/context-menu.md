---
contentSchemaVersion: 1
title: Context Menu
description: Styled context menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the context-menu primitive.
keywords: [context-menu, right-click, menu, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Context Menu
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "context-menu"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "30d956103831d184d4ce85c877925dfb5ecd3770fb4ef5976a696a17d93d3c20"
translationStatus: draft
---

Styled context menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the context-menu primitive.

## Uso

El componente Context Menu es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/context-menu`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as ContextMenu from "@solidiom/recipes-css"

;<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Cut</ContextMenu.Item>
    <ContextMenu.Item>Copy</ContextMenu.Item>
    <ContextMenu.Item>Paste</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```


## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/context-menu` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/context-menu`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages menu state.
- **Trigger** — the element that opens the menu on right-click.
- **Content** — the menu panel containing items.
- **Item** — individual menu item.
- **Separator** — visual separator between menu groups.
- **Sub** — submenu container for nested menus.

## Variantes y estados

Context Menu hereda su soporte de variantes y estados de `@solidiom/context-menu`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Context Menu está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-context-menu` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Context Menu se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Context Menu delega la accesibilidad a `@solidiom/context-menu`. Consulta el [contrato de accesibilidad del primitivo Context Menu](/primitives/context-menu/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
