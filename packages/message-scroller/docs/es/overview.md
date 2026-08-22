---
contentSchemaVersion: 1
title: Message Scroller
description: Contenedor de mensajes con desplazamiento automático e indicadores de contenido nuevo.
keywords: [message, scroller, auto-scroll, scroll anchor, indicator, container, utility]
locale: es
maturity: ga
product: Message Scroller
productLayer: primitive
status: draft
package: "@solidiom/message-scroller"
primitive: message-scroller
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "960f15bfa0a53b9c8d38749a0f575c3d48186d40ac06bee54d452f04b313a0e9"
translationStatus: "draft"
---

Message Scroller es un contenedor de mensajes con desplazamiento automático e indicadores de contenido nuevo. Usa `createScrollAnchor` para gestionar el desplazamiento automático y expone `isAtBottom`, `hasNewContent` y `newContentCount` mediante contexto. NewContentIndicator aparece cuando llega contenido nuevo mientras el usuario se ha desplazado hacia arriba.

## Uso

Compón `Root`, `ScrollArea` y `NewContentIndicator`.

```tsx
import * as MessageScroller from "@solidiom/message-scroller"

function Scroller() {
  return (
    <MessageScroller.Root>
      <MessageScroller.ScrollArea>{/* mensajes */}</MessageScroller.ScrollArea>
      <MessageScroller.NewContentIndicator>Nuevos mensajes</MessageScroller.NewContentIndicator>
    </MessageScroller.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/message-scroller`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

message-scroller expone 3 partes:

- **Root** — `data-part="root"`. Contenedor que gestiona el desplazamiento automático mediante un ancla y expone `isAtBottom`, `hasNewContent` y `newContentCount` mediante contexto.
- **ScrollArea** — `data-part="scrollarea"`. Región desplazable que contiene los mensajes.
- **NewContentIndicator** — `data-part="newcontentindicator"`. Aparece cuando llega contenido nuevo mientras el usuario se ha desplazado hacia arriba.

## Estilos

message-scroller incluye los atributos `data-scope="message-scroller"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Message Scroller se compone alrededor de listas de mensajes de chat y otro contenido transmitido para gestionar el desplazamiento automático y mostrar indicadores de contenido nuevo.

## SSR e hidratación

Message Scroller renderiza su estructura en el servidor y activa durante la hidratación la gestión del ancla de desplazamiento y el seguimiento del contenido nuevo.
