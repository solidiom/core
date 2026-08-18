---
contentSchemaVersion: 1
title: Alert
description: Styled alert component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert primitive.
keywords: [alert, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Alert
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "alert"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "d809bcd2045db692daf8c21089db1282a64e817b48677e30ba8492ff5ccd54ba"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled alert component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert primitive.

## Uso

El componente Alert es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/alert`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Alert } from "@solidiom/recipes-css"

;<Alert>Contenido</Alert>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/alert` correspondiente como dependencia par.

## Anatomía

El componente Alert envuelve el primitivo `@solidiom/alert`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Alert hereda su soporte de variantes y estados de `@solidiom/alert`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Alert está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-alert` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Alert se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Alert delega la accesibilidad a `@solidiom/alert`. Consulta el [contrato de accesibilidad del primitivo Alert](/primitives/alert/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
