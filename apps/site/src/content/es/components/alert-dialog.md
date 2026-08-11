---
contentSchemaVersion: 1
title: Alert Dialog
description: Styled alert dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert-dialog primitive.
keywords: [alert-dialog, modal, confirmation, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Alert Dialog
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "alert-dialog"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "3a70186082f206641156305a4e83fc6e95f00cd28cc5c3b5f9bdf836febff48b"
translationStatus: draft
---

Styled alert dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert-dialog primitive.

## Uso

El componente Alert Dialog es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/alert-dialog`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as AlertDialog from "@solidiom/recipes-css"

;<AlertDialog.Root>
  <AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Are you sure?</AlertDialog.Title>
    <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Confirm</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/alert-dialog` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/alert-dialog`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages open/closed state.
- **Trigger** — the button that opens the dialog.
- **Content** — the dialog panel containing the alert message and actions.
- **Title** — the dialog heading.
- **Description** — the dialog description text.
- **Cancel** — the button that dismisses the dialog without action.
- **Action** — the button that confirms the destructive action.

## Variantes y estados

Alert Dialog hereda su soporte de variantes y estados de `@solidiom/alert-dialog`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Alert Dialog está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-alert-dialog` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Alert Dialog se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Alert Dialog delega la accesibilidad a `@solidiom/alert-dialog`. Consulta el [contrato de accesibilidad del primitivo Alert Dialog](/primitives/alert-dialog/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
