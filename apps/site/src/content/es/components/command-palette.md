---
contentSchemaVersion: 1
title: Command Palette
description: Styled command palette component — the recipe wrapper for the css, tailwind, unocss profile(s) using the command-palette primitive.
keywords: [command, palette, kbd, shortcut, search, overlay, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Command Palette
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "command-palette"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "63caaf508bb415e09527cfd73a47d881914a143e3cb4e4efb441a9de8c5d0592"
translationStatus: draft
---

Styled command palette component — the recipe wrapper for the css, tailwind, unocss profile(s) using the command-palette primitive.

## Uso

El componente Command Palette es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/command-palette`. Proporciona un panel de comandos superpuesto con búsqueda de comandos, agrupación, y navegación por teclado para acceso rápido a acciones.

```tsx
import { StyledCommandPalette } from "@solidiom/recipes-css"

;<StyledCommandPalette open={state()} onOpenChange={set}>
  <StyledCommandPalette.Input placeholder="Type a command..." />
  <StyledCommandPalette.List>
    <StyledCommandPalette.Group heading="Actions">
      <StyledCommandPalette.Item onSelect={() => {}}>Action 1</StyledCommandPalette.Item>
    </StyledCommandPalette.Group>
  </StyledCommandPalette.List>
</StyledCommandPalette>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/command-palette` correspondiente como dependencia par.

## Anatomía

El componente Command Palette envuelve el primitivo `@solidiom/command-palette`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el proveedor que gestiona el estado del command palette.
- **Input** — el campo de búsqueda de comandos.
- **List** — la lista de resultados de comandos.
- **Group** — un grupo de comandos con encabezado.
- **Item** — un comando individual seleccionable.
- **Separator** — separador visual entre grupos.

## Variantes y estados

Command Palette hereda su soporte de variantes y estados de `@solidiom/command-palette`. El primitivo implementa el patrón WAI-ARIA combobox/listbox con navegación por teclado y soporte para lectores de pantalla. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Command Palette está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-command-palette` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Command Palette se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Command Palette delega la accesibilidad a `@solidiom/command-palette`. El primitivo implementa el patrón WAI-ARIA combobox/listbox con navegación por teclado y soporte para lectores de pantalla. Consulta el [contrato de accesibilidad del primitivo Command Palette](/primitives/command-palette/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
