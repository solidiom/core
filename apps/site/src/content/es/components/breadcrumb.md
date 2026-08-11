---
contentSchemaVersion: 1
title: Breadcrumb
description: Styled breadcrumb component — the recipe wrapper for the css, tailwind, unocss profile(s) using the breadcrumb primitive.
keywords: [breadcrumb, navigation, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Breadcrumb
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "breadcrumb"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "0af56d3373384cdacb1c4bce8a6f5491d990af02faa3a9651520121c10389593"
translationStatus: draft
---

Styled breadcrumb component — the recipe wrapper for the css, tailwind, unocss profile(s) using the breadcrumb primitive.

## Uso

El componente Breadcrumb es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/breadcrumb`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledBreadcrumb, Breadcrumb } from "@solidiom/recipes-css"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Documentación</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/breadcrumb` correspondiente como dependencia par.

## Anatomía

El componente Breadcrumb envuelve el primitivo `@solidiom/breadcrumb`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **List** — el contenedor de lista ordenada para los elementos del breadcrumb.
- **Item** — entrada individual del breadcrumb.
- **Link** — enlace de navegación dentro de un elemento del breadcrumb.
- **Separator** — separador visual entre elementos del breadcrumb.
- **Ellipsis** — indicador para elementos del breadcrumb omitidos.

## Variantes y estados

Breadcrumb hereda su soporte de variantes y estados de `@solidiom/breadcrumb`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Breadcrumb está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-breadcrumb` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Breadcrumb se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Breadcrumb delega la accesibilidad a `@solidiom/breadcrumb`. Consulta el [contrato de accesibilidad del primitivo Breadcrumb](/primitives/breadcrumb/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
