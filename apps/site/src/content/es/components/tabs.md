---
contentSchemaVersion: 1
title: Tabs
description: Styled tabs component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tabs primitive.
keywords: [component, css, tabs, tailwind, unocss]
locale: es
maturity: beta
product: Tabs
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "tabs"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "5522e271495793b6118a87da78bce6b920b5df0963c77301ff2be8cfb03c3267"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled tabs component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tabs primitive.

## Uso

El componente Tabs es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/tabs`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledTabs } from "@solidiom/recipes-css"

;<StyledTabs>Contenido</StyledTabs>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/tabs` correspondiente como dependencia par.

## Anatomía

El componente Tabs envuelve el primitivo `@solidiom/tabs`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Tabs hereda su soporte de variantes y estados de `@solidiom/tabs`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Tabs está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-tabs` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Tabs se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Tabs delega la accesibilidad a `@solidiom/tabs`. Consulta el [contrato de accesibilidad del primitivo Tabs](/primitives/tabs/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
