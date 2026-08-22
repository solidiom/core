---
contentSchemaVersion: 1
title: Dialog
description: Styled dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the dialog primitive.
keywords: [component, css, dialog, tailwind, unocss]
locale: es
maturity: beta
product: Dialog
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "dialog"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "ca4a7cf6d13ee6ca3cb9a3d75e594e20840bfde91b58e13638d886209fe20c08"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the dialog primitive.

## Uso

El componente Dialog es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/dialog`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledDialog } from "@solidiom/recipes-css"

;<StyledDialog trigger={<button type="button">Abrir</button>} title="Diálogo">
  Contenido
</StyledDialog>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/dialog` correspondiente como dependencia par.

## Anatomía

El componente Dialog envuelve el primitivo `@solidiom/dialog`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Dialog hereda su soporte de variantes y estados de `@solidiom/dialog`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Dialog está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-dialog` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Dialog se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Dialog delega la accesibilidad a `@solidiom/dialog`. Consulta el [contrato de accesibilidad del primitivo Dialog](/primitives/dialog/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
