---
contentSchemaVersion: 1
title: Date Picker
description: Styled date picker component — the recipe wrapper for the css, tailwind, unocss profile(s) using the date-picker primitive.
keywords: [date-picker, date, input, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Date Picker
productLayer: component
status: published
package: "@solidiom/date-picker"
translationSourceHash: "f5dbe73e95515632aefa7d1743ae3c97e705d49198b0a635f92442ae29c8d4c5"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled date picker component — the recipe wrapper for the css, tailwind, unocss profile(s) using the date-picker primitive.

## Uso

El componente Date Picker es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/date-picker`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as DatePicker from "@solidiom/date-picker"

;<DatePicker.Root>
  <DatePicker.Label>Select date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

## Instalación

```sh
pnpm add @solidiom/date-picker
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/date-picker` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/date-picker`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages picker state.
- **Label** — the accessible label for the input.
- **Input** — the text input displaying the selected date.
- **Trigger** — the button that opens the calendar popup.
- **Content** — the popup container for the calendar.
- **Calendar** — the embedded calendar for date selection.

## Variantes y estados

Date Picker hereda su soporte de variantes y estados de `@solidiom/date-picker`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Date Picker está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-date-picker` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Date Picker se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Date Picker delega la accesibilidad a `@solidiom/date-picker`. Consulta el [contrato de accesibilidad del primitivo Date Picker](/primitives/date-picker/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
