---
contentSchemaVersion: 1
title: Checkbox
description: Styled checkbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the checkbox primitive.
keywords: [checkbox, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Checkbox
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "checkbox"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "9d96704753a79d21a27b6649188a74323db742292fd57982c98de8c488ecd62c"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled checkbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the checkbox primitive.

## Uso

El componente Checkbox es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/checkbox`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Checkbox } from "@solidiom/recipes-css"

;<Checkbox>Contenido</Checkbox>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/checkbox` correspondiente como dependencia par.

## Anatomía

El componente Checkbox envuelve el primitivo `@solidiom/checkbox`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Checkbox hereda su soporte de variantes y estados de `@solidiom/checkbox`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Checkbox está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-checkbox` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Checkbox se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Checkbox delega la accesibilidad a `@solidiom/checkbox`. Consulta el [contrato de accesibilidad del primitivo Checkbox](/primitives/checkbox/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
