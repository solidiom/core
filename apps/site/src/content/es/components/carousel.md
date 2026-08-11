---
contentSchemaVersion: 1
title: Carousel
description: Styled carousel component — the recipe wrapper for the css, tailwind, unocss profile(s) using the carousel primitive.
keywords: [carousel, slider, slideshow, component, css, tailwind, unocss]
locale: es
maturity: beta
product: Carousel
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "carousel"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "0c7667be4acb9c7c24692c2e03f02393339327a857abd29489d5fa4942430e57"
translationStatus: draft
---

Styled carousel component — the recipe wrapper for the css, tailwind, unocss profile(s) using the carousel primitive.

## Uso

El componente Carousel es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/carousel`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import * as Carousel from "@solidiom/recipes-css"

;<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.PrevTrigger />
  <Carousel.NextTrigger />
</Carousel.Root>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/carousel` correspondiente como dependencia par.

## Anatomía

El componente envuelve el primitivo `@solidiom/carousel`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — the wrapper element that manages carousel state.
- **Content** — the scrollable container for slides.
- **Item** — individual slide within the carousel.
- **PrevTrigger** — navigates to the previous slide.
- **NextTrigger** — navigates to the next slide.
- **Indicators** — dot indicators showing current position.

## Variantes y estados

Carousel hereda su soporte de variantes y estados de `@solidiom/carousel`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

Carousel está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-carousel` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Carousel se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Carousel delega la accesibilidad a `@solidiom/carousel`. Consulta el [contrato de accesibilidad del primitivo Carousel](/primitives/carousel/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
