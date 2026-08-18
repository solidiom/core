---
contentSchemaVersion: 1
title: Empty State
description: Styled empty state component — the recipe wrapper for the css, tailwind, unocss profile(s) using the empty-state primitive.
keywords: [empty-state, placeholder, no-data, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Empty State
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "empty-state"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "f707ecc423f6b999140d294f58478703c8ba255817464d0335389068759f0b14"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled empty state component — the recipe wrapper for the css, tailwind, unocss profile(s) using the empty-state primitive.

## Uso

El componente Empty State es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/empty-state`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as EmptyState from "@solidiom/recipes-css"

;<EmptyState.Root>
  <EmptyState.Icon />
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
  <EmptyState.Action>Clear filters</EmptyState.Action>
</EmptyState.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/empty-state` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/empty-state`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that provides the empty state container.
- **Icon** — an optional icon or illustration.
- **Title** — the heading describing the empty state.
- **Description** — additional context or guidance.
- **Action** — a call-to-action button to resolve the empty state.

## Variantes y estados

Empty State hereda su soporte de variantes y estados de `@solidiom/empty-state`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Empty State está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-empty-state` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Empty State se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Empty State delega la accesibilidad a `@solidiom/empty-state`. Consulta el [contrato de accesibilidad del primitivo Empty State](/primitives/empty-state/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
