---
contentSchemaVersion: 1
title: Card
description: Container component with header, title, description, content, and footer areas.
keywords: [card, container, layout, header, footer, content]
locale: es
maturity: draft
product: Card
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "card"
stylingOutputs: ["css", "tailwind", "unocss"]
translationSourceHash: "2270a6fe1ccf14954433172dee97d3ee21828668cd2c1a6ce559cf6224ad1ea8"
translationStatus: draft
---

Contenedor con encabezado, título, descripción, contenido y pie de página.

## Uso

El componente Card es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/card`. Proporciona una capa de composición para contenedores de contenido con estilos semánticos para secciones de encabezado, título, descripción, contenido principal y pie de página.

```tsx
import { StyledCard, Card } from "@solidiom/recipes-css"

;<StyledCard>
  <Card.Header>
    <Card.Title>Título de la Tarjeta</Card.Title>
    <Card.Description>El texto de descripción de la tarjeta va aquí.</Card.Description>
  </Card.Header>
  <Card.Content>Área de contenido principal.</Card.Content>
  <Card.Footer>Contenido del pie de página.</Card.Footer>
</StyledCard>
```

## Instalación

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo `@solidiom/card` correspondiente como dependencia par.

## Anatomía

El componente Card envuelve el primitivo `@solidiom/card`. Expone seis partes a través de una capa de composición con receta aplicada:

- **Root** — contenedor con borde, radio de borde y estilo de fondo.
- **Header** — contenedor flex column para agrupar título y descripción.
- **Title** — elemento de encabezado con tamaño de fuente grande y peso seminegrita.
- **Description** — elemento de párrafo con tamaño de fuente pequeño y color atenuado.
- **Content** — área de contenido principal sin estilos base, para flexibilidad del consumidor.
- **Footer** — contenedor flex row con alineación vertical para botones de acción o metadatos.

## Variantes y estados

Card no utiliza variantes ni estados. Es un componente de contenedor puramente estructural. Todo el estilo es impulsado por los estilos base de la receta aplicados a cada parte.

## Estilos

Card está disponible en los perfiles css, tailwind, unocss. Cada perfil aplica las mismas partes semánticas y estructura, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres `solidiom-card` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

Card se renderiza como elementos HTML semánticos `<div>`, `<h3>` y `<p>` durante el renderizado en servidor. No se requiere JavaScript para el renderizado; la capa de receta no añade comportamiento interactivo más allá del primitivo subyacente.

## Accesibilidad

Card delega la accesibilidad a `@solidiom/card`. El primitivo renderiza elementos HTML semánticos con roles apropiados. El envoltorio no añade cambios de comportamiento que afecten la accesibilidad. Consulta el [contrato de accesibilidad del primitivo Card](/primitives/card/accessibility/) para el contrato completo de teclado, foco y ARIA.