---
contentSchemaVersion: 1
title: Label
description: Styled label component — the recipe wrapper for the css, tailwind, unocss profile(s) using the label primitive.
keywords: [label, form, input, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Label
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "label"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "88a1fc067ee2421e379ec528a446f66b5d6f81d27c7ee6b8fddb24a62f614dde"
translationStatus: draft
---

Styled label component — the recipe wrapper for the css, tailwind, unocss profile(s) using the label primitive.

## Uso

El componente Label es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/label`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Label } from "@solidiom/recipes-css"

;<Label for="email">Email address</Label>
```


## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/label` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/label`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the label element that applies recipe styles and delegates to the primitive.

## Variantes y estados

Label hereda su soporte de variantes y estados de `@solidiom/label`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Label está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-label` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Label se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Label delega la accesibilidad a `@solidiom/label`. Consulta el [contrato de accesibilidad del primitivo Label](/primitives/label/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
