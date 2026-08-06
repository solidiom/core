---
contentSchemaVersion: 1
title: Radio Group
description: Styled radio group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the radio-group primitive.
keywords: [radio, group, selection, single, component, css, tailwind, unocss]
locale: es
maturity: draft
product: Radio Group
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "radio-group"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "b544f0c19a96ad7c60d309d65def23c300d63d106859a278cc83874258e87df0"
translationStatus: draft
---

Styled radio group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the radio-group primitive.

## Uso

El componente Radio Group es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/radio-group`. Proporciona selección única en un grupo de opciones, con navegación por teclado y estados de selección accesibles.

```tsx
import { StyledRadioGroup } from "@solidiom/recipes-css"

;<StyledRadioGroup value={state()} onChange={set}>
  <label>
    <input type="radio" name="group" value="a" />
    Option A
  </label>
  <label>
    <input type="radio" name="group" value="b" />
    Option B
  </label>
</StyledRadioGroup>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/radio-group` correspondiente como dependencia par.

## Anatomía

El componente Radio Group envuelve el primitivo `@solidiom/radio-group`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **Item** — cada opción individual del grupo de radio.

## Variantes y estados

Radio Group hereda su soporte de variantes y estados de `@solidiom/radio-group`. El primitivo implementa el patrón WAI-ARIA radiogroup con navegación por teclado roving tabindex donde las teclas de flecha mueven el foco y seleccionan. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Radio Group está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-radio-group` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Radio Group se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Radio Group delega la accesibilidad a `@solidiom/radio-group`. El primitivo implementa el patrón WAI-ARIA radiogroup con navegación por teclado roving tabindex donde las teclas de flecha mueven el foco y seleccionan. Consulte el `evidence.json` del primitivo para el contrato de accesibilidad y los resultados de las pruebas.
