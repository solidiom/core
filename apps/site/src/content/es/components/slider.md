---
contentSchemaVersion: 1
title: Slider
description: Styled slider component — the recipe wrapper for the css, tailwind, unocss profile(s) using the slider primitive.
keywords: [slider, range, input, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Slider
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "slider"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "f1239d2d3d9a4a631825656e8f240578f1f0f330e1944e6de55f56967c0edfc8"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled slider component — the recipe wrapper for the css, tailwind, unocss profile(s) using the slider primitive.

## Uso

El componente Slider es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/slider`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Slider from "@solidiom/recipes-css"

;<Slider.Root min={0} max={100} value={50}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/slider` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/slider`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages slider state.
- **Track** — the track along which the thumb slides.
- **Range** — the filled portion of the track.
- **Thumb** — the draggable handle.
- **Label** — optional accessible label.

## Variantes y estados

Slider hereda su soporte de variantes y estados de `@solidiom/slider`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Slider está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-slider` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Slider se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Slider delega la accesibilidad a `@solidiom/slider`. Consulta el [contrato de accesibilidad del primitivo Slider](/primitives/slider/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
