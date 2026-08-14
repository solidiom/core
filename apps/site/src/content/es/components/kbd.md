---
contentSchemaVersion: 1
title: Kbd
description: Styled keyboard display component — the recipe wrapper for the css, tailwind, unocss profile(s) using the kbd primitive.
keywords: [kbd, keyboard, shortcut, display, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Kbd
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "kbd"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "6d13e46f0787425396cb3eb5898038bdd9abf0ad8ab22cabef7fa40fa7c6ec9f"
translationStatus: draft
---

Styled keyboard display component — the recipe wrapper for the css, tailwind, unocss profile(s) using the kbd primitive.

## Uso

El componente Kbd es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/kbd`. Renderiza un elemento de teclado semántico para mostrar accesos directos.

```tsx
import { StyledKbd } from "@solidiom/recipes-css"

;<StyledKbd>Ctrl</StyledKbd>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/kbd` correspondiente como dependencia par.

## Anatomía

El componente Kbd envuelve el primitivo `@solidiom/kbd`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Kbd no tiene soporte de variantes ni estados. Es un elemento de visualización simple para teclas de teclado.

## Estilos

Kbd está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-kbd` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Kbd se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Kbd delega la accesibilidad a `@solidiom/kbd`. El primitivo utiliza el elemento nativo `<kbd>` para el significado semántico integrado de entrada de teclado. Consulta el [contrato de accesibilidad del primitivo Kbd](/primitives/kbd/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
