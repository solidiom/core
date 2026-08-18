---
contentSchemaVersion: 1
title: Virtual List
description: Styled virtual list component — the recipe wrapper for the css, tailwind, unocss profile(s) using the virtual-list primitive.
keywords: [virtual-list, virtualization, infinite-scroll, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Virtual List
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "virtual-list"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "b13d63ac2a1993a122184bf761113e7c590966f41e7a66e3f414b83e5fe53016"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled virtual list component — the recipe wrapper for the css, tailwind, unocss profile(s) using the virtual-list primitive.

## Uso

El componente Virtual List es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/virtual-list`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as VirtualList from "@solidiom/recipes-css"

;<VirtualList.Root count={10000} estimateSize={() => 40}>
  {(item) => <VirtualList.Item>{item.index}</VirtualList.Item>}
</VirtualList.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/virtual-list` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/virtual-list`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages virtualization state.
- **Item** — individual rendered item within the visible window.

## Variantes y estados

Virtual List hereda su soporte de variantes y estados de `@solidiom/virtual-list`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Virtual List está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-virtual-list` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Virtual List se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Virtual List delega la accesibilidad a `@solidiom/virtual-list`. Consulta el [contrato de accesibilidad del primitivo Virtual List](/primitives/virtual-list/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
