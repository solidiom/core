---
contentSchemaVersion: 1
title: Meter
description: Styled meter component — the recipe wrapper for the css, tailwind, unocss profile(s) using the meter primitive.
keywords: [meter, measurement, gauge, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Meter
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "meter"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "8886f24c64a4a245a06f471224bf0b40b86338739e0aea0ed1bceabf2bc9bd74"
translationStatus: draft
---

Styled meter component — the recipe wrapper for the css, tailwind, unocss profile(s) using the meter primitive.

## Uso

El componente Meter es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/meter`. Añade composición, slots de estilo semántico y estilizado basado en estado mientras delega toda la normalización de valores y la lógica de umbrales al primitivo subyacente.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={0.7} min={0} max={1} />
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/meter` correspondiente como dependencia par.

## Anatomía

El componente Meter envuelve el primitivo `@solidiom/meter`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Meter hereda su soporte de variantes y estados de `@solidiom/meter`. El primitivo deriva estados de estado ("safe", "caution", "danger") de umbrales de valor (low, high, optimum). Consulta la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Meter está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-meter` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Meter se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Meter delega la accesibilidad a `@solidiom/meter`. El primitivo utiliza el elemento nativo `<meter>` para semánticas de accesibilidad integradas. Consulta el [contrato de accesibilidad del primitivo Meter](/primitives/meter/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
