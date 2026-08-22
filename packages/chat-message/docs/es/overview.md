---
contentSchemaVersion: 1
title: Chat Message
description: Burbuja de mensaje para interfaces conversacionales con remitente, contenido y metadatos.
keywords: [chat, message, bubble, sender, avatar, content, conversation]
locale: es
maturity: ga
product: Chat Message
productLayer: primitive
status: draft
package: "@solidiom/chat-message"
primitive: chat-message
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "fe589019011862d2f0c83d499656bb4fb5e9a4188ddf7b389cf7b408bbe4d381"
translationStatus: "draft"
---

Chat Message es una burbuja de mensaje para interfaces conversacionales con remitente, contenido y metadatos. Proporciona una estructura accesible para mensajes de chat, con variantes para mensajes enviados o recibidos, un espacio para avatar y contenedores de acciones.

## Uso

Compón `Root`, `Content`, `Avatar` y `Actions`.

```tsx
import * as ChatMessage from "@solidiom/chat-message"

function Message() {
  return (
    <ChatMessage.Root>
      <ChatMessage.Avatar>
        <img src="/users/ada.png" alt="Ada" />
      </ChatMessage.Avatar>
      <ChatMessage.Content>Hola, ¿seguimos con lo de hoy?</ChatMessage.Content>
      <ChatMessage.Actions>
        <button>Responder</button>
      </ChatMessage.Actions>
    </ChatMessage.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-message`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-message expone 4 partes:

- **Root** — `data-part="root"`. Contenedor de la burbuja con variantes para mensajes enviados o recibidos.
- **Content** — `data-part="content"`. Contiene el contenido del mensaje.
- **Avatar** — `data-part="avatar"`. Espacio para el avatar del remitente.
- **Actions** — `data-part="actions"`. Contenedor de acciones del mensaje.

## Estilos

chat-message incluye los atributos `data-scope="chat-message"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Chat Message se compone dentro de diseños y listas de mensajes, junto con primitivos de metadatos y mensajes del sistema.

## SSR e hidratación

Chat Message renderiza HTML estático y no requiere hidratación, ya que es un primitivo estructural y visual.
