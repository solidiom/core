---
contentSchemaVersion: 1
title: Banner
description: Barra de notificación del sitio que se puede cerrar.
keywords: [banner, notification, dismissible, alert, feedback, bar, close]
locale: es
maturity: ga
product: Banner
productLayer: primitive
status: draft
package: "@solidiom/banner"
primitive: banner
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "a0fd1101c515ba44830fdd81a01ed97a47f83e52fe8a869c07cb620659850b74"
translationStatus: "draft"
---

Banner proporciona una barra de notificación del sitio que se puede cerrar. La parte Close cierra el banner cuando se activa.

## Uso

Compón `Root`, `Content` y `Close`.

```tsx
import * as Banner from "@solidiom/banner"

function AnnouncementBanner() {
  return (
    <Banner.Root>
      <Banner.Content>Hemos actualizado nuestros términos de servicio.</Banner.Content>
      <Banner.Close>Descartar</Banner.Close>
    </Banner.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/banner`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

banner expone 3 partes:

- **Root** — `data-part="root"`. Contenedor de la barra de notificación.
- **Content** — `data-part="content"`. Contiene el mensaje de notificación.
- **Close** — `data-part="close"`. Cierra el banner cuando se activa.

## Estilos

banner incluye los atributos `data-scope="banner"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia más allá del control Close, que cierra el banner cuando se activa.

## Composición

Banner se compone con texto, enlaces y acciones en línea dentro de su Content, y puede colocarse en la parte superior de un diseño de página.

## SSR e hidratación

Banner renderiza HTML estático en el servidor; el control Close activa su manejador de cierre durante la hidratación.
