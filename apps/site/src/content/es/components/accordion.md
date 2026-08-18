---
contentSchemaVersion: 1
title: Accordion
description: Styled accordion component — the recipe wrapper for the css, tailwind, unocss profile(s) using the accordion primitive.
keywords: [accordion, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Accordion
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "accordion"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "a00cbcb8c2ec2b6a7b0da914579ff3d250cf1f7f97818a76eb3c0d6bc308c9d4"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled accordion component — the recipe wrapper for the css, tailwind, unocss profile(s) using the accordion primitive.

## Uso

El componente Accordion es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/accordion`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Accordion } from "@solidiom/recipes-css"

;<Accordion>Contenido</Accordion>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/accordion` correspondiente como dependencia par.

## Anatomía

El componente Accordion envuelve el primitivo `@solidiom/accordion`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Accordion hereda su soporte de variantes y estados de `@solidiom/accordion`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Accordion está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-accordion` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Accordion se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Accordion delega la accesibilidad a `@solidiom/accordion`. Consulta el [contrato de accesibilidad del primitivo Accordion](/primitives/accordion/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
