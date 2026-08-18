---
contentSchemaVersion: 1
title: Toast
description: Styled toast component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toast primitive.
keywords: [component, css, tailwind, toast, unocss]
locale: es
maturity: beta
product: Toast
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toast"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "bd3b6c7196077c92b57df1d2bad84d4cfd11095546db7d0571ce1493bcefc74d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled toast component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toast primitive.

## Uso

El componente Toast es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/toast`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { Toast } from "@solidiom/recipes-css"

;<Toast>Contenido</Toast>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/toast` correspondiente como dependencia par.

## Anatomía

El componente Toast envuelve el primitivo `@solidiom/toast`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

Toast hereda su soporte de variantes y estados de `@solidiom/toast`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Toast está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-toast` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Toast se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Toast delega la accesibilidad a `@solidiom/toast`. Consulta el [contrato de accesibilidad del primitivo Toast](/primitives/toast/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
