---
contentSchemaVersion: 1
title: Tree
description: Styled tree component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tree primitive.
keywords: [tree, treeview, hierarchy, file-explorer, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Tree
productLayer: component
status: published
package: "@solidiom/tree"
translationSourceHash: "b1a283b647b0e75dea341e0bbb49cda75502ac77648a6c1fc4d905eecab03bf9"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled tree component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tree primitive.

## Uso

El componente Tree es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/tree`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Tree from "@solidiom/tree"

;<Tree.Root>
  <Tree.Item value="src">
    <Tree.ItemText>src</Tree.ItemText>
    <Tree.Branch>
      <Tree.Item value="index">
        <Tree.ItemText>index.ts</Tree.ItemText>
      </Tree.Item>
    </Tree.Branch>
  </Tree.Item>
</Tree.Root>
```

## Instalación

```sh
pnpm add @solidiom/tree
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/tree` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/tree`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages tree state.
- **Item** — a node in the tree (may be a leaf or branch).
- **ItemText** — the text label for a tree item.
- **Branch** — a collapsible container for child items.
- **Indicator** — expand/collapse indicator for branch items.

## Variantes y estados

Tree hereda su soporte de variantes y estados de `@solidiom/tree`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Tree está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-tree` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Tree se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Tree delega la accesibilidad a `@solidiom/tree`. Consulta el [contrato de accesibilidad del primitivo Tree](/primitives/tree/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
