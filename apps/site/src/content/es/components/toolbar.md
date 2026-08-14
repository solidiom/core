---
contentSchemaVersion: 1
title: Toolbar
description: Styled toolbar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toolbar primitive.
keywords: [toolbar, tools, actions, group, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Toolbar
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toolbar"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "7c7d0305a33067c9a63b33b5ad421aa9af066dad942e7ad46d58e3def5977619"
translationStatus: draft
---

Styled toolbar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toolbar primitive.

## Uso

El componente Toolbar es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/toolbar`. Proporciona una barra de herramientas con grupos de acciones y navegación por teclado con roving tabindex para el acceso rápido a herramientas y operaciones.

```tsx
import { StyledToolbar } from "@solidiom/recipes-css"

;<StyledToolbar>
  <StyledToolbar.Button>Undo</StyledToolbar.Button>
  <StyledToolbar.Button>Redo</StyledToolbar.Button>
  <StyledToolbar.Separator />
  <StyledToolbar.Button>Save</StyledToolbar.Button>
</StyledToolbar>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/toolbar` correspondiente como dependencia par.

## Anatomía

El componente Toolbar envuelve el primitivo `@solidiom/toolbar`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el contenedor principal de la barra de herramientas.
- **Button** — un botón de acción individual.
- **Separator** — separador visual entre grupos de herramientas.
- **Link** — un enlace de navegación dentro de la barra.

## Variantes y estados

Toolbar hereda su soporte de variantes y estados de `@solidiom/toolbar`. El primitivo implementa el patrón WAI-ARIA toolbar con navegación por teclado roving tabindex. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Toolbar está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-toolbar` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Toolbar se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Toolbar delega la accesibilidad a `@solidiom/toolbar`. El primitivo implementa el patrón WAI-ARIA toolbar con navegación por teclado roving tabindex. Consulta el [contrato de accesibilidad del primitivo Toolbar](/primitives/toolbar/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
