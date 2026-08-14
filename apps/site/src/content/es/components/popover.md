---
contentSchemaVersion: 1
title: Popover
description: Styled popover component — the recipe wrapper for the css, tailwind, unocss profile(s) using the popover primitive.
keywords: [component, css, popover, tailwind, unocss]
locale: es
maturity: beta
product: Popover
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "popover"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "59b97dbfc7144ef1456c0b56668148fe2c2675dd6b7a4ed29ac4c5636ae5d43d"
translationStatus: draft
---

Styled popover component — the recipe wrapper for the css, tailwind, unocss profile(s) using the popover primitive.

## Uso

El componente Popover es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/popover`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Popover } from "@solidiom/recipes-css"

;<Popover>Contenido</Popover>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/popover` correspondiente como dependencia par.

## Anatomía

El componente Popover envuelve el primitivo `@solidiom/popover`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Popover hereda su soporte de variantes y estados de `@solidiom/popover`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Popover está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-popover` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Popover se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Popover delega la accesibilidad a `@solidiom/popover`. Consulta el [contrato de accesibilidad del primitivo Popover](/primitives/popover/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
