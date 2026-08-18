---
contentSchemaVersion: 1
title: Hover Card
description: Styled hover card component — the recipe wrapper for the css, tailwind, unocss profile(s) using the hover-card primitive.
keywords: [hover-card, popover, preview, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Hover Card
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "hover-card"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "793adaf451eaaa24d6786957afb7771fd42b5ea4a3d58cb5cec72ede556961b8"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled hover card component — the recipe wrapper for the css, tailwind, unocss profile(s) using the hover-card primitive.

## Uso

El componente Hover Card es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/hover-card`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as HoverCard from "@solidiom/recipes-css"

;<HoverCard.Root>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Preview content appears on hover.</p>
  </HoverCard.Content>
</HoverCard.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/hover-card` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/hover-card`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages hover state.
- **Trigger** — the element that triggers the card on hover.
- **Content** — the card panel that appears on hover.
- **Arrow** — optional arrow pointing to the trigger.

## Variantes y estados

Hover Card hereda su soporte de variantes y estados de `@solidiom/hover-card`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Hover Card está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-hover-card` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Hover Card se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Hover Card delega la accesibilidad a `@solidiom/hover-card`. Consulta el [contrato de accesibilidad del primitivo Hover Card](/primitives/hover-card/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
