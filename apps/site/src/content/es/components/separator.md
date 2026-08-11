---
contentSchemaVersion: 1
title: Separator
description: Styled separator component — the recipe wrapper for the css, tailwind, unocss profile(s) using the separator primitive.
keywords: [separator, divider, hr, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Separator
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "separator"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "9e49d76bd5fbb6e1ff3a9096e9a117302ffecd5c75fdb8186dcd03e5ea37781d"
translationStatus: draft
---

Styled separator component — the recipe wrapper for the css, tailwind, unocss profile(s) using the separator primitive.

## Uso

El componente Separator es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/separator`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Separator } from "@solidiom/recipes-css"

;<Separator orientation="horizontal" />
```


## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/separator` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/separator`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the separator element that applies recipe styles and delegates to the primitive.

## Variantes y estados

Separator hereda su soporte de variantes y estados de `@solidiom/separator`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Separator está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-separator` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Separator se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Separator delega la accesibilidad a `@solidiom/separator`. Consulta el [contrato de accesibilidad del primitivo Separator](/primitives/separator/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
