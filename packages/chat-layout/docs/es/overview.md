---
contentSchemaVersion: 1
title: Chat Layout
description: Contenedor que gestiona el flujo de mensajes, el desplazamiento y la posición del compositor.
keywords: [chat, layout, container, scroll, composer, header, messages]
locale: es
maturity: ga
product: Chat Layout
productLayer: primitive
status: draft
package: "@solidiom/chat-layout"
primitive: chat-layout
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "4e3f1544b2d3b7b21de84a76a0277bc7a86c8fd468f20f596b5c9fdc96111e27"
translationStatus: "draft"
---

Chat Layout es un contenedor que gestiona el flujo de mensajes, el desplazamiento y la posición del compositor. Es una columna flex puramente estructural que ocupa toda la altura, con un área de mensajes desplazable y secciones fijas para el encabezado y el compositor inferior.

## Uso

Compón `Root`, `MessageList`, `Composer` y `Header`.

```tsx
import * as ChatLayout from "@solidiom/chat-layout"

function Conversation() {
  return (
    <ChatLayout.Root>
      <ChatLayout.Header>Soporte</ChatLayout.Header>
      <ChatLayout.MessageList>{/* mensajes */}</ChatLayout.MessageList>
      <ChatLayout.Composer>{/* compositor */}</ChatLayout.Composer>
    </ChatLayout.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-layout`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-layout expone 4 partes:

- **Root** — `data-part="root"`. Columna flex que ocupa toda la altura y organiza las secciones del diseño.
- **MessageList** — `data-part="messagelist"`. Área de mensajes desplazable.
- **Composer** — `data-part="composer"`. Sección fija del compositor inferior.
- **Header** — `data-part="header"`. Sección de encabezado fija.

## Estilos

chat-layout incluye los atributos `data-scope="chat-layout"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Chat Layout se compone con primitivos de mensajes, compositores y encabezados dentro de sus secciones estructurales.

## SSR e hidratación

Chat Layout renderiza HTML estático y no requiere hidratación, ya que es un primitivo puramente estructural.
