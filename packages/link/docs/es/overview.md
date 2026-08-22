---
contentSchemaVersion: 1
title: Link
description: Ancla estilizada con integración de router y validación de seguridad.
keywords: [link, anchor, router, href, external, sanitization, navigation]
locale: es
maturity: ga
product: Link
productLayer: primitive
status: draft
package: "@solidiom/link"
primitive: link
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "244c248f8b72416e4093d77aa00e5eb86582b85a3c94fc5b08b3e0f33aad5831"
translationStatus: "draft"
---

Link es un ancla estilizada con integración de router y validación de seguridad. Proporciona saneamiento de `href` y soporte para enlaces externos.

## Uso

Link tiene una única parte `Root`.

```tsx
import * as Link from "@solidiom/link"

function Nav() {
  return <Link.Root href="https://example.com">Visitar ejemplo</Link.Root>
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/link`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Link tiene una única parte `Root` con `data-part="root"`: un ancla estilizada con saneamiento de `href` y soporte para enlaces externos.

## Estilos

link incluye `data-scope="link"` y un atributo `data-part` en su Root para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia más allá de la activación nativa del ancla.

## Composición

Link se compone en cualquier lugar donde se necesite navegación en línea, integrándose con el router y gestionando de forma segura los `href` externos.

## SSR e hidratación

Link se renderiza como un ancla estándar en el servidor y activa la integración con el router durante la hidratación.
