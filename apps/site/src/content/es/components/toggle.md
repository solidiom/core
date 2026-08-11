---
contentSchemaVersion: 1
title: Toggle
description: Styled toggle component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle primitive.
keywords: [toggle, button, pressed, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Toggle
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toggle"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "9fb3cec98b49dc3608ea79a783cd5e39166778fbcf7b7e3b305cb28e81b406cd"
translationStatus: draft
---

Styled toggle component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle primitive.

## Uso

El componente Toggle es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/toggle`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Toggle } from "@solidiom/recipes-css"

;<Toggle aria-label="Toggle bold">
  <strong>B</strong>
</Toggle>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/toggle` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/toggle`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the toggle button element that applies recipe styles and delegates to the primitive.

## Variantes y estados

Toggle hereda su soporte de variantes y estados de `@solidiom/toggle`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Toggle está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-toggle` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Toggle se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Toggle delega la accesibilidad a `@solidiom/toggle`. Consulta el [contrato de accesibilidad del primitivo Toggle](/primitives/toggle/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
