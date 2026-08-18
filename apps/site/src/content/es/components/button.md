---
contentSchemaVersion: 1
title: Button
description: Styled button component — the recipe wrapper for the css, tailwind, unocss profile(s) using the button primitive.
keywords: [button, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Button
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "button"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "eed1b4e427b1de8673e34c0c53eb7ffe2ddadea9b8e198971a3d70126a37f2ac"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled button component — the recipe wrapper for the css, tailwind, unocss profile(s) using the button primitive.

## Uso

El componente Button es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/button`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Button } from "@solidiom/recipes-css"

;<Button>Contenido</Button>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/button` correspondiente como dependencia par.

## Anatomía

El componente Button envuelve el primitivo `@solidiom/button`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Button hereda su soporte de variantes y estados de `@solidiom/button`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Button está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-button` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Button se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Button delega la accesibilidad a `@solidiom/button`. Consulta el [contrato de accesibilidad del primitivo Button](/primitives/button/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
