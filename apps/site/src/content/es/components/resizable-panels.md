---
contentSchemaVersion: 1
title: Resizable Panels
description: Styled resizable panels component — the recipe wrapper for the css, tailwind, unocss profile(s) using the resizable-panels primitive.
keywords: [resizable, panels, panel, split, layout, resize, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Resizable Panels
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "resizable-panels"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "10de596d182577369db592d08e06a9defa089ee4550d25e40474e3fbf138f021"
translationStatus: draft
---

Styled resizable panels component — the recipe wrapper for the css, tailwind, unocss profile(s) using the resizable-panels primitive.

## Uso

El componente Resizable Panels es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/resizable-panels`. Proporciona paneles redimensionables con un controlador arrastrable entre ellos, útil para layouts de dos o más paneles adyacentes.

```tsx
import { StyledResizablePanels } from "@solidiom/recipes-css"

;<StyledResizablePanels direction="horizontal">
  <StyledResizablePanels.Panel defaultSize={50}>Left Panel</StyledResizablePanels.Panel>
  <StyledResizablePanels.Handle />
  <StyledResizablePanels.Panel defaultSize={50}>Right Panel</StyledResizablePanels.Panel>
</StyledResizablePanels>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/resizable-panels` correspondiente como dependencia par.

## Anatomía

El componente Resizable Panels envuelve el primitivo `@solidiom/resizable-panels`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el contenedor principal que gestiona el estado de redimensionamiento.
- **Panel** — un panel redimensionable individual.
- **Handle** — el controlador arrastrable entre paneles.

## Variantes y estados

Resizable Panels hereda su soporte de variantes y estados de `@solidiom/resizable-panels`. El primitivo proporciona controladores de redimensionamiento accesibles por teclado y estructura semántica de paneles. El soporte de variantes incluye la propiedad `direction` para controlar la dirección de redimensionamiento (horizontal o vertical). Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Resizable Panels está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-resizable-panels` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Resizable Panels se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Resizable Panels delega la accesibilidad a `@solidiom/resizable-panels`. El primitivo proporciona controladores de redimensionamiento accesibles por teclado y estructura semántica de paneles. Consulta el [contrato de accesibilidad del primitivo Resizable Panels](/primitives/resizable-panels/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
