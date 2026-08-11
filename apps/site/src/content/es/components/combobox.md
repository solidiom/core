---
contentSchemaVersion: 1
title: Combobox
description: Styled combobox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the combobox primitive.
keywords: [combobox, select, input, dropdown, listbox, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Combobox
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "combobox"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "97fd814333dde282f3accf8ffd4e60457c82ca814069edd9d1ea9fdbfff1ccaa"
translationStatus: draft
---

Styled combobox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the combobox primitive.

## Uso

El componente Combobox es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/combobox`. Proporciona un campo de entrada con lista desplegable para selección de opciones con filtrado por texto.

```tsx
import { StyledCombobox } from "@solidiom/recipes-css"

;<StyledCombobox options={OPTIONS} value={state()} onChange={set} placeholder="Select an option" />
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/combobox` correspondiente como dependencia par.

## Anatomía

El componente Combobox envuelve el primitivo `@solidiom/combobox`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **Trigger** — el botón que activa la lista desplegable.
- **Content** — el panel de opciones desplegable.
- **Item** — cada opción individual en la lista.

## Variantes y estados

Combobox hereda su soporte de variantes y estados de `@solidiom/combobox`. El primitivo implementa el patrón WAI-ARIA combobox con navegación por teclado, gestión de foco y soporte para lectores de pantalla. Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Combobox está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-combobox` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Combobox se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Combobox delega la accesibilidad a `@solidiom/combobox`. El primitivo implementa el patrón WAI-ARIA combobox con navegación por teclado adecuada, gestión de foco y soporte para lectores de pantalla. Consulta el [contrato de accesibilidad del primitivo Combobox](/primitives/combobox/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
