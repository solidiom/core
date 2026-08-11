---
contentSchemaVersion: 1
title: Progress
description: Indicador de progreso lineal con modos determinista e indeterminado.
keywords: [progress, indicator, loading, determinate, indeterminate, bar]
locale: es
maturity: beta
product: Progress
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "progress"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "1c246351c45be1861ff8b3b0e0f3f62e66641c1755c0f62b92375154e001dc46"
translationStatus: draft
---

Indicador de progreso lineal con modos determinista e indeterminado.

## Uso

El componente Progress es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/progress`. Proporciona una representación visual de la finalización de tareas con estilos semánticos para la pista de progreso y el indicador de llenado.

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={65}>
  <Progress.Indicator />
</StyledProgress>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/progress` correspondiente como dependencia par.

## Anatomía

El componente Progress envuelve el primitivo `@solidiom/progress`. Expone dos partes a través de una capa de composición con receta aplicada:

- **Root** — el elemento contenedor con `role="progressbar"`, fondo de pista redondeado y atributos de valor ARIA.
- **Indicator** — el elemento visual de llenado que representa el valor actual del progreso.

## Variantes y estados

Progress soporta dos estados heredados del primitivo:

- **loading** — progreso activo, el valor está entre 0 y el máximo.
- **complete** — el progreso ha alcanzado su valor máximo.

Pasa `value={null}` para un estado de progreso indeterminado.

## Estilos

Progress está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica las mismas partes semánticas y estructura, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-progress` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Progress se renderiza como elementos HTML semánticos `<div>` con `role="progressbar"` durante el renderizado en servidor. No se requiere JavaScript para el renderizado; la capa de receta no añade comportamiento interactivo más allá del primitivo subyacente.

## Accesibilidad

Progress delega la accesibilidad a `@solidiom/progress`. El primitivo se renderiza con los atributos `role="progressbar"`, `aria-valuenow`, `aria-valuemin` y `aria-valuemax`. El envoltorio no añade cambios de comportamiento que afecten la accesibilidad. Consulta el [contrato de accesibilidad del primitivo Progress](/primitives/progress/accessibility/) para el contrato completo de ARIA.
