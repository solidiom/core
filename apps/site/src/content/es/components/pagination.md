---
contentSchemaVersion: 1
title: Pagination
description: Styled pagination component — the recipe wrapper for the css, tailwind, unocss profile(s) using the pagination primitive.
keywords: [pagination, navigation, page, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Pagination
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "pagination"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "ffcfbd624c6ca3bfcbba63683c574edeae2deb4531e6070623022afc0a030ec5"
translationStatus: draft
---

Styled pagination component — the recipe wrapper for the css, tailwind, unocss profile(s) using the pagination primitive.

## Uso

El componente Pagination es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/pagination`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { StyledPagination } from "@solidiom/recipes-css"
import * as Pagination from "@solidiom/pagination"

;<StyledPagination>
  <Pagination.PreviousButton>Anterior</Pagination.PreviousButton>
  <Pagination.Content>
    <Pagination.Item>
      <button type="button">1</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">2</button>
    </Pagination.Item>
    <Pagination.Item>
      <button type="button">3</button>
    </Pagination.Item>
  </Pagination.Content>
  <Pagination.NextButton>Siguiente</Pagination.NextButton>
</StyledPagination>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/pagination` correspondiente como dependencia par.

## Anatomía

El componente Pagination envuelve el primitivo `@solidiom/pagination`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.
- **Content** — el contenedor de lista para los elementos de página.
- **Item** — elementos individuales de número de página.
- **PreviousButton** — botón de navegación para ir a la página anterior.
- **NextButton** — botón de navegación para ir a la siguiente página.
- **Ellipsis** — separador visual para páginas omitidas.

## Variantes y estados

Pagination hereda su soporte de variantes y estados de `@solidiom/pagination`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Pagination está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-pagination` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Pagination se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Pagination delega la accesibilidad a `@solidiom/pagination`. Consulta el [contrato de accesibilidad del primitivo Pagination](/primitives/pagination/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
