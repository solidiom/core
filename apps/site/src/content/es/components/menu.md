---
contentSchemaVersion: 1
title: Menu
description: Styled menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the menu primitive.
keywords: [component, css, menu, tailwind, unocss]
locale: es
maturity: beta
product: Menu
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "menu"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "e4fb5603569cd60e44a7b99961e1bdc788c47e505aa94e1f11d510d41198a794"
translationStatus: draft
---

Styled menu component — the recipe wrapper for the css, tailwind, unocss profile(s) using the menu primitive.

## Uso

El componente Menu es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/menu`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Menu } from "@solidiom/recipes-css"

;<Menu>Contenido</Menu>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/menu` correspondiente como dependencia par.

## Anatomía

El componente Menu envuelve el primitivo `@solidiom/menu`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Menu hereda su soporte de variantes y estados de `@solidiom/menu`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Menu está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-menu` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Menu se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Menu delega la accesibilidad a `@solidiom/menu`. Consulta el [contrato de accesibilidad del primitivo Menu](/primitives/menu/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
