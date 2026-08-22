---
contentSchemaVersion: 1
title: Listbox
description: Styled listbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the listbox primitive.
keywords: [listbox, list, selection, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Listbox
productLayer: component
status: published
package: "@solidiom/listbox"
translationSourceHash: "9efab80c0f35ad278872f75d0ea3210afd707f1270b61993ee3d7cc06e5bfeaf"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Styled listbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the listbox primitive.

## Uso

El componente Listbox es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/listbox`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Listbox from "@solidiom/listbox"

;<Listbox.Root>
  <Listbox.Label>Choose a framework</Listbox.Label>
  <Listbox.Content>
    <Listbox.Item value="solid">SolidJS</Listbox.Item>
    <Listbox.Item value="react">React</Listbox.Item>
    <Listbox.Item value="vue">Vue</Listbox.Item>
  </Listbox.Content>
</Listbox.Root>
```

## Instalación

```sh
pnpm add @solidiom/listbox
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/listbox` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/listbox`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages listbox state.
- **Label** — the accessible label for the listbox.
- **Content** — the scrollable list container.
- **Item** — individual selectable item.
- **ItemGroup** — groups related items together.
- **ItemGroupLabel** — label for item groups.

## Variantes y estados

Listbox hereda su soporte de variantes y estados de `@solidiom/listbox`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Listbox está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-listbox` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Listbox se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Listbox delega la accesibilidad a `@solidiom/listbox`. Consulta el [contrato de accesibilidad del primitivo Listbox](/primitives/listbox/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
