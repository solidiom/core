---
contentSchemaVersion: 1
title: Spinner
description: Styled spinner component — the recipe wrapper for the css, tailwind, unocss profile(s) using the spinner primitive.
keywords: [spinner, loading, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Spinner
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "spinner"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "aa4cde00e706a154aafc78f8e5655bcf35a6649121fcba7eefa2b8d1b1b63949"
translationStatus: draft
---

Styled spinner component — the recipe wrapper for the css, tailwind, unocss profile(s) using the spinner primitive.

## Uso

El componente Spinner es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/spinner`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner>Cargando...</StyledSpinner>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/spinner` correspondiente como dependencia par.

## Anatomía

El componente Spinner envuelve el primitivo `@solidiom/spinner`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Spinner hereda su soporte de variantes y estados de `@solidiom/spinner`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Spinner está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-spinner` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Spinner se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Spinner delega la accesibilidad a `@solidiom/spinner`. Consulta el [contrato de accesibilidad del primitivo Spinner](/primitives/spinner/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
