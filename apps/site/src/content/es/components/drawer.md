---
contentSchemaVersion: 1
title: Drawer
description: Styled drawer component — the recipe wrapper for the css, tailwind, unocss profile(s) using the drawer primitive.
keywords: [drawer, panel, slide, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Drawer
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "drawer"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "4dc6ac5f24d156196ca5274be81ef8ac8ebe3ac181d4f9029576469db5eadcb2"
translationStatus: draft
---

Styled drawer component — the recipe wrapper for the css, tailwind, unocss profile(s) using the drawer primitive.

## Uso

El componente Drawer es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/drawer`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Drawer from "@solidiom/recipes-css"

;<Drawer.Root>
  <Drawer.Trigger>Open drawer</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Drawer Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>Content goes here</Drawer.Body>
    <Drawer.Footer>
      <Drawer.CloseTrigger>Close</Drawer.CloseTrigger>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/drawer` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/drawer`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that opens the drawer.
- **Content** — the slide-in panel container.
- **Header** — the drawer header area.
- **Title** — the drawer heading.
- **Body** — the main content area.
- **Footer** — the drawer footer with actions.
- **CloseTrigger** — the button that closes the drawer.

## Variantes y estados

Drawer hereda su soporte de variantes y estados de `@solidiom/drawer`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Drawer está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-drawer` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Drawer se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Drawer delega la accesibilidad a `@solidiom/drawer`. Consulta el [contrato de accesibilidad del primitivo Drawer](/primitives/drawer/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
