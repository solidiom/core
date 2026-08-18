---
contentSchemaVersion: 1
title: Calendar
description: Styled calendar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the calendar primitive.
keywords: [calendar, date, picker, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Calendar
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "calendar"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "5915f5c222c587f398cac0596522746da3656d6db25ae2e253b26d2a7449e3ed"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled calendar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the calendar primitive.

## Uso

El componente Calendar es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/calendar`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Calendar from "@solidiom/recipes-css"

;<Calendar.Root>
  <Calendar.Header>
    <Calendar.PrevTrigger />
    <Calendar.ViewTrigger />
    <Calendar.NextTrigger />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader />
    <Calendar.GridBody />
  </Calendar.Grid>
</Calendar.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/calendar` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/calendar`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages calendar state.
- **Header** — the navigation bar with month/year controls.
- **PrevTrigger** — navigates to the previous month.
- **NextTrigger** — navigates to the next month.
- **ViewTrigger** — switches between day/month/year views.
- **Grid** — the calendar grid container.
- **GridHeader** — the day-of-week header row.
- **GridBody** — the grid body containing day cells.

## Variantes y estados

Calendar hereda su soporte de variantes y estados de `@solidiom/calendar`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Calendar está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-calendar` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Calendar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Calendar delega la accesibilidad a `@solidiom/calendar`. Consulta el [contrato de accesibilidad del primitivo Calendar](/primitives/calendar/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
