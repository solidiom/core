---
contentSchemaVersion: 1
title: Chat Message Metadata
description: Marcas de tiempo, confirmaciones de lectura e información del remitente para mensajes de chat.
keywords: [chat, metadata, timestamp, sender, status, receipt, message]
locale: es
maturity: ga
product: Chat Message Metadata
productLayer: primitive
status: draft
package: "@solidiom/chat-message-metadata"
primitive: chat-message-metadata
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "7c0afcbc776a3578a18fb6bcc83b79d826d74642cd957ef529ae2de626de068d"
translationStatus: "draft"
---

Chat Message Metadata muestra marcas de tiempo, confirmaciones de lectura e información del remitente para mensajes de chat. Proporciona metadatos estructurados con elementos `time` semánticos e indicadores del estado de entrega.

## Uso

Compón `Root`, `Timestamp`, `Sender` y `Status`.

```tsx
import * as ChatMessageMetadata from "@solidiom/chat-message-metadata"

function Metadata() {
  return (
    <ChatMessageMetadata.Root>
      <ChatMessageMetadata.Sender>Ada</ChatMessageMetadata.Sender>
      <ChatMessageMetadata.Timestamp>10:42 AM</ChatMessageMetadata.Timestamp>
      <ChatMessageMetadata.Status>Leído</ChatMessageMetadata.Status>
    </ChatMessageMetadata.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-message-metadata`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-message-metadata expone 4 partes:

- **Root** — `data-part="root"`. Contenedor de los metadatos estructurados.
- **Timestamp** — `data-part="timestamp"`. Renderiza un elemento time semántico para la hora del mensaje.
- **Sender** — `data-part="sender"`. Muestra la información del remitente.
- **Status** — `data-part="status"`. Indicador del estado de entrega.

## Estilos

chat-message-metadata incluye los atributos `data-scope="chat-message-metadata"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Chat Message Metadata se compone dentro de primitivos de mensajes de chat para anotar mensajes individuales con información temporal y de entrega.

## SSR e hidratación

Chat Message Metadata renderiza HTML estático y no necesita hidratación, ya que es un primitivo estructural y visual.
