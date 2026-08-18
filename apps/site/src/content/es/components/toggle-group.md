---
contentSchemaVersion: 1
title: Toggle Group
description: Styled toggle group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle-group primitive.
keywords: [toggle-group, button-group, segmented, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Toggle Group
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toggle-group"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "e47b2788ddf9879b9370eaefc0d19db740d94cf8636fb53900cafc8f6debd08e"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled toggle group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle-group primitive.

## Uso

El componente Toggle Group es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/toggle-group`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as ToggleGroup from "@solidiom/recipes-css"

;<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/toggle-group` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/toggle-group`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages group state and selection.
- **Item** — individual toggle button within the group.

## Variantes y estados

Toggle Group hereda su soporte de variantes y estados de `@solidiom/toggle-group`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Toggle Group está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-toggle-group` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Toggle Group se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Toggle Group delega la accesibilidad a `@solidiom/toggle-group`. Consulta el [contrato de accesibilidad del primitivo Toggle Group](/primitives/toggle-group/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
