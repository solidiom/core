---
contentSchemaVersion: 1
title: Select
description: Styled select component — the recipe wrapper for the css, tailwind, unocss profile(s) using the select primitive.
keywords: [component, css, select, tailwind, unocss]
locale: es
maturity: beta
product: Select
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "select"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "d375bff66a00a70815df08c0c996e276a93f7c59ffd63aa827bf82eae8eccc94"
translationStatus: draft
---

Styled select component — the recipe wrapper for the css, tailwind, unocss profile(s) using the select primitive.

## Uso

El componente Select es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/select`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Select } from "@solidiom/recipes-css"

;<Select>Contenido</Select>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/select` correspondiente como dependencia par.

## Anatomía

El componente Select envuelve el primitivo `@solidiom/select`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Select hereda su soporte de variantes y estados de `@solidiom/select`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Select está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-select` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Select se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Select delega la accesibilidad a `@solidiom/select`. Consulta el [contrato de accesibilidad del primitivo Select](/primitives/select/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
