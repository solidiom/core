---
contentSchemaVersion: 1
title: Switch
description: Styled switch component — the recipe wrapper for the css, tailwind, unocss profile(s) using the switch primitive.
keywords: [component, css, switch, tailwind, unocss]
locale: es
maturity: draft
product: Switch
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "switch"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "08c4f9699419042ad53c8fc369774a3650255a00f537499cd877432d3d337d1c"
translationStatus: draft
---

Styled switch component — the recipe wrapper for the css, tailwind, unocss profile(s) using the switch primitive.

## Uso

El componente Switch es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/switch`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Switch } from "@solidiom/recipes-css"

;<Switch>Contenido</Switch>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/switch` correspondiente como dependencia par.

## Anatomía

El componente Switch envuelve el primitivo `@solidiom/switch`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Switch hereda su soporte de variantes y estados de `@solidiom/switch`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Switch está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-switch` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Switch se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Switch delega la accesibilidad a `@solidiom/switch`. Consulta el [contrato de accesibilidad del primitivo Switch](/primitives/switch/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
