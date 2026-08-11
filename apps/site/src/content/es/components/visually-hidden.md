---
contentSchemaVersion: 1
title: Visually Hidden
description: Styled visually hidden component — the recipe wrapper for the css, tailwind, unocss profile(s) using the visually-hidden primitive.
keywords: [visually-hidden, sr-only, accessibility, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Visually Hidden
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "visually-hidden"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "3ed01974c7f271af7fbb9dbd91d7139fbe49dcf9a3d02de3d32233c300eb088c"
translationStatus: draft
---

Styled visually hidden component — the recipe wrapper for the css, tailwind, unocss profile(s) using the visually-hidden primitive.

## Uso

El componente Visually Hidden es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/visually-hidden`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { VisuallyHidden } from "@solidiom/recipes-css"

;<button>
  <VisuallyHidden>Close dialog</VisuallyHidden>
  <span aria-hidden="true">×</span>
</button>
```


## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/visually-hidden` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/visually-hidden`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that applies screen-reader-only styles.

## Variantes y estados

Visually Hidden hereda su soporte de variantes y estados de `@solidiom/visually-hidden`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Visually Hidden está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-visually-hidden` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Visually Hidden se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Visually Hidden delega la accesibilidad a `@solidiom/visually-hidden`. Consulta el [contrato de accesibilidad del primitivo Visually Hidden](/primitives/visually-hidden/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
