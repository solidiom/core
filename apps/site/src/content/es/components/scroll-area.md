---
contentSchemaVersion: 1
title: Scroll Area
description: Styled scroll area component — the recipe wrapper for the css, tailwind, unocss profile(s) using the scroll-area primitive.
keywords: [scroll, area, scrollbar, overflow, component, css, tailwind, unocss]
locale: es
maturity: draft
product: Scroll Area
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "scroll-area"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "d4885ddf3e6b07411d48d1d038159d69b8799a7865be525346d8afff39da8c60"
translationStatus: draft
---

Styled scroll area component — the recipe wrapper for the css, tailwind, unocss profile(s) using the scroll-area primitive.

## Uso

El componente Scroll Area es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/scroll-area`. Proporciona un área de desplazamiento con barra de desplazamiento estilizada y comportamiento consistente en todos los navegadores.

```tsx
import { StyledScrollArea } from "@solidiom/recipes-css"

;<StyledScrollArea style={{ height: "400px" }}>
  <div>Scrollable content goes here...</div>
</StyledScrollArea>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/scroll-area` correspondiente como dependencia par.

## Anatomía

El componente Scroll Area envuelve el primitivo `@solidiom/scroll-area`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el contenedor principal del área de desplazamiento.
- **Viewport** — el viewport visible dentro del área de desplazamiento.
- **Scrollbar** — la barra de desplazamiento estilizada.
- **Thumb** — el controlador arrastrable de la barra de desplazamiento.

## Variantes y estados

Scroll Area hereda su soporte de variantes y estados de `@solidiom/scroll-area`. El primitivo mantiene el comportamiento nativo de desplazamiento para plena compatibilidad con teclado y lectores de pantalla. El soporte de variantes incluye la propiedad `orientation` para controlar la dirección del desplazamiento (vertical u horizontal). Consulte la documentación del primitivo para la lista completa de props soportados y estados interactivos.

## Estilos

Scroll Area está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-scroll-area` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Scroll Area se renderiza como HTML semántico durante el renderizado en servidor. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

Scroll Area delega la accesibilidad a `@solidiom/scroll-area`. El primitivo mantiene el comportamiento nativo de desplazamiento para plena compatibilidad con teclado y lectores de pantalla. Consulte el `evidence.json` del primitivo para el contrato de accesibilidad y los resultados de las pruebas.
