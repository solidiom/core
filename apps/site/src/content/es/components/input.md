---
contentSchemaVersion: 1
title: Input
description: Styled text input and textarea component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input primitive.
keywords: [input, textarea, form, text, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Input
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "input"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "188a0599367291039ee43fddfaef89b786fc1d1dc297a3b25b857587637a3fac"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled text input and textarea component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input primitive.

## Uso

El componente Input es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/input`. Añade estilos semánticos para estados de validación (invalid, disabled, readonly) y anillos de foco mientras delega todo el comportamiento de formulario al primitivo subyacente.

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput placeholder="Enter your email" type="email" />
;<StyledTextarea placeholder="Enter a message" rows={4} />
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/input` correspondiente como dependencia par.

## Anatomía

El componente Input envuelve el primitivo `@solidiom/input`. Expone dos partes a través de una capa de composición con receta aplicada:

- **StyledInput** — entrada de texto de una línea con estilos de receta y hooks de estado de validación.
- **StyledTextarea** — área de texto de varias líneas con las mismas convenciones de estilo.

## Variantes y estados

Input no utiliza variantes. El estilo es impulsado por el estado de validación:

- **Invalid** — borde rojo cuando el valor de entrada falla la validación.
- **Disabled** — fondo atenuado y opacidad reducida.
- **Readonly** — fondo atenuado con cursor not-allowed.
- **Focus** — borde con color primario y anillo de foco en `:focus-visible`.

## Estilos

Input está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos estados semánticos y comportamiento de foco, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-input` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Input se renderiza como HTML semántico `<input>` o `<textarea>` durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Input delega la accesibilidad a `@solidiom/input`. Consulta el [contrato de accesibilidad del primitivo Input](/primitives/input/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
