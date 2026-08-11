---
contentSchemaVersion: 1
title: Skeleton
description: Styled skeleton component — the recipe wrapper for the css, tailwind, unocss profile(s) using the skeleton primitive.
keywords: [skeleton, loading, placeholder, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Skeleton
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "skeleton"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "477ad3d3bd6d4add4035b9489a5a7bf277cae63aed510a6929a850cc7c6b61e9"
translationStatus: draft
---

Styled skeleton component — the recipe wrapper for the css, tailwind, unocss profile(s) using the skeleton primitive.

## Uso

El componente Skeleton es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/skeleton`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Skeleton } from "@solidiom/recipes-css"

;<div>
  <Skeleton variant="circle" />
  <Skeleton variant="text" />
  <Skeleton variant="rectangular" />
</div>
```


## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/skeleton` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/skeleton`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the skeleton element that applies recipe styles and the pulsing animation.

## Variantes y estados

Skeleton hereda su soporte de variantes y estados de `@solidiom/skeleton`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Skeleton está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-skeleton` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Skeleton se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Skeleton delega la accesibilidad a `@solidiom/skeleton`. Consulta el [contrato de accesibilidad del primitivo Skeleton](/primitives/skeleton/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
