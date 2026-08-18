---
contentSchemaVersion: 1
title: Avatar
description: Styled avatar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the avatar primitive.
keywords: [avatar, image, user, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Avatar
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "avatar"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "f96835a6c7e72959c4a75f87aeedfcc80758ab50cbb2fdd033d19fc0ac0dcb96"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled avatar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the avatar primitive.

## Uso

El componente Avatar es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/avatar`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/user.jpg" alt="Usuario" fallback="U" />
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/avatar` correspondiente como dependencia par.

## Anatomía

El componente Avatar envuelve el primitivo `@solidiom/avatar`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **Image** — el elemento de imagen mostrado cuando la carga tiene éxito.
- **Fallback** — se muestra mientras la imagen carga o si la imagen falla.

## Variantes y estados

Avatar hereda su soporte de variantes y estados de `@solidiom/avatar`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Avatar está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-avatar` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Avatar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Avatar delega la accesibilidad a `@solidiom/avatar`. Consulta el [contrato de accesibilidad del primitivo Avatar](/primitives/avatar/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
