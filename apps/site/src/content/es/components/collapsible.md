---
contentSchemaVersion: 1
title: Collapsible
description: Styled collapsible component — the recipe wrapper for the css, tailwind, unocss profile(s) using the collapsible primitive.
keywords: [collapsible, disclosure, expand, collapse, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Collapsible
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "collapsible"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "e65bf19a03db2b7bf7ba14e518e12f3651de4524c5fab88eb80c242105a3c32e"
translationStatus: draft
---

Styled collapsible component — the recipe wrapper for the css, tailwind, unocss profile(s) using the collapsible primitive.

## Uso

El componente Collapsible es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/collapsible`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Collapsible from "@solidiom/recipes-css"

;<Collapsible.Root>
  <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content can be expanded or collapsed.</p>
  </Collapsible.Content>
</Collapsible.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/collapsible` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/collapsible`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that toggles the content visibility.
- **Content** — the collapsible content panel.

## Variantes y estados

Collapsible hereda su soporte de variantes y estados de `@solidiom/collapsible`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Collapsible está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-collapsible` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Collapsible se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Collapsible delega la accesibilidad a `@solidiom/collapsible`. Consulta el [contrato de accesibilidad del primitivo Collapsible](/primitives/collapsible/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
