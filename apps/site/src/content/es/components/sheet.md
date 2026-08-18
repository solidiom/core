---
contentSchemaVersion: 1
title: Sheet
description: Styled sheet component — the recipe wrapper for the css, tailwind, unocss profile(s) using the sheet primitive.
keywords: [sheet, drawer, overlay, dialog, slide, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Sheet
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "sheet"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "055624387439b293dbd372a467a61d24fbe2ace828bcba4e4c3f811aecc806a6"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled sheet component — the recipe wrapper for the css, tailwind, unocss profile(s) using the sheet primitive.

## Uso

El componente Sheet es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/sheet`. Proporciona un panel deslizante que aparece desde el borde de la pantalla, útil para formularios laterales, navegación y paneles de información.

```tsx
import { StyledSheet } from "@solidiom/recipes-css"

;<StyledSheet open={state()} onOpenChange={set}>
  <StyledSheet.Trigger>Open Sheet</StyledSheet.Trigger>
  <StyledSheet.Content side="right">
    <StyledSheet.Title>Sheet Title</StyledSheet.Title>
    <StyledSheet.Description>Description text</StyledSheet.Description>
    Content goes here
  </StyledSheet.Content>
</StyledSheet>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/sheet` correspondiente como dependencia par.

## Anatomía

El componente Sheet envuelve el primitivo `@solidiom/sheet`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el proveedor que gestiona el estado del sheet.
- **Trigger** — el botón que activa la apertura del sheet.
- **Content** — el panel deslizante principal.
- **Title** — el título accesible del sheet.
- **Description** — la descripción accesible del sheet.
- **Close** — el botón para cerrar el sheet.

## Variantes y estados

Sheet hereda su soporte de variantes y estados de `@solidiom/sheet`. El primitivo implementa aislamiento modal, gestión de ámbito de foco y bloqueo de desplazamiento para diálogos superpuestos accesibles. El soporte de variantes incluye la propiedad `side` para controlar el lado desde el cual aparece el sheet. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Sheet está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-sheet` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Sheet se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Sheet delega la accesibilidad a `@solidiom/sheet`. El primitivo implementa aislamiento modal, gestión de ámbito de foco y bloqueo de desplazamiento para diálogos superpuestos accesibles. Consulta el [contrato de accesibilidad del primitivo Sheet](/primitives/sheet/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
