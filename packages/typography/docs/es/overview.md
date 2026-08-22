---
contentSchemaVersion: 1
title: Typography
description: Primitivos de texto semántico para encabezados, párrafos y texto en línea.
keywords: [typography, heading, text, paragraph, inline code, blockquote, semantic]
locale: es
maturity: ga
product: Typography
productLayer: primitive
status: draft
package: "@solidiom/typography"
primitive: typography
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "10520e09d717336e2f4bc8ea821ab8c7fb73f53eee3c32255bc8a0cad02e624d"
translationStatus: "draft"
---

Typography es un conjunto de primitivos de texto semántico para encabezados, párrafos y texto en línea. No existe una parte Root; cada primitivo se usa directamente: `Heading` renderiza un elemento de encabezado, `Text` un párrafo, `Lead` un párrafo introductorio, `Small` texto pequeño, `Muted` texto atenuado, `InlineCode` código en línea y `Blockquote` una cita.

## Uso

Usa las partes directamente; no hay un `Root` envolvente. Importa y compón `Heading`, `Text`, `Lead`, `Small`, `Muted`, `InlineCode` y `Blockquote` según sea necesario.

```tsx
import * as Typography from "@solidiom/typography"

;<>
  <Typography.Heading>Primeros pasos</Typography.Heading>
  <Typography.Lead>Una breve introducción al tema.</Typography.Lead>
  <Typography.Text>
    Texto de cuerpo con <Typography.InlineCode>código en línea</Typography.InlineCode> y{" "}
    <Typography.Muted>texto atenuado</Typography.Muted>.
  </Typography.Text>
  <Typography.Blockquote>Una cita memorable.</Typography.Blockquote>
  <Typography.Small>Texto en letra pequeña.</Typography.Small>
</>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/typography`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

typography expone 7 partes:

- **Heading** — renderiza un elemento de encabezado.
- **Text** — renderiza un párrafo.
- **Lead** — renderiza un párrafo introductorio.
- **Small** — renderiza texto pequeño.
- **Muted** — renderiza texto atenuado.
- **InlineCode** — renderiza código en línea.
- **Blockquote** — renderiza una cita.

## Estilos

typography incluye los atributos `data-scope="typography"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Usa estos primitivos de texto dentro de cualquier diseño o composición de contenido para aplicar una tipografía semántica coherente.

## SSR e hidratación

Typography renderiza HTML estático y no requiere hidratación.
