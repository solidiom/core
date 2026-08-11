---
contentSchemaVersion: 1
title: Badge
description: Styled badge component — the recipe wrapper for the css, tailwind, unocss profile(s) using the badge primitive.
keywords: [badge, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Badge
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "badge"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "03b28660444c76f93be4d4e410f391f190a6023084c727531c0a1084e3e16195"
translationStatus: draft
---

Styled badge component — the recipe wrapper for the css, tailwind, unocss profile(s) using the badge primitive.

## Uso

El componente Badge es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/badge`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Badge } from "@solidiom/recipes-css"

;<Badge>Contenido</Badge>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/badge` correspondiente como dependencia par.

## Anatomía

El componente Badge envuelve el primitivo `@solidiom/badge`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Badge hereda su soporte de variantes y estados de `@solidiom/badge`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Badge está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-badge` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Badge se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Badge delega la accesibilidad a `@solidiom/badge`. Consulta el [contrato de accesibilidad del primitivo Badge](/primitives/badge/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
