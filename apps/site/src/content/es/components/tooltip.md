---
contentSchemaVersion: 1
title: Tooltip
description: Styled tooltip component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tooltip primitive.
keywords: [component, css, tailwind, tooltip, unocss]
locale: es
maturity: draft
product: Tooltip
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tooltip"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "d15212f2f28d3d92f46ae54008912a06ec6928394bde89f222d298d459654f5f"
translationStatus: draft
---

Styled tooltip component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tooltip primitive.

## Uso

El componente Tooltip es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/tooltip`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Tooltip } from "@solidiom/recipes-css"

;<Tooltip>Contenido</Tooltip>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/tooltip` correspondiente como dependencia par.

## Anatomía

El componente Tooltip envuelve el primitivo `@solidiom/tooltip`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Tooltip hereda su soporte de variantes y estados de `@solidiom/tooltip`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Tooltip está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-tooltip` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Tooltip se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Tooltip delega la accesibilidad a `@solidiom/tooltip`. Consulta el [contrato de accesibilidad del primitivo Tooltip](/primitives/tooltip/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
