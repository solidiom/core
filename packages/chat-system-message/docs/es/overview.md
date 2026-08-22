---
contentSchemaVersion: 1
title: Chat System Message
description: Mensajes de sistema y anuncios de bots en conversaciones.
keywords: [chat, system, announcement, status, aria-live, bot, message]
locale: es
maturity: ga
product: Chat System Message
productLayer: primitive
status: draft
package: "@solidiom/chat-system-message"
primitive: chat-system-message
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "b3c9df4abb97a95b72cce250d5f5506d0d4cf30a4934ca8e5249a4bab0cf50f5"
translationStatus: "draft"
---

Chat System Message renderiza mensajes de sistema y anuncios de bots en conversaciones. Usa `role=status` con `aria-live=polite` para anuncios accesibles y admite mensajes tipados: info, warning, error, join y leave.

## Uso

Compón `Root`, `Icon`, `Content` y `Timestamp`.

```tsx
import * as ChatSystemMessage from "@solidiom/chat-system-message"

function SystemNotice() {
  return (
    <ChatSystemMessage.Root>
      <ChatSystemMessage.Icon>ℹ️</ChatSystemMessage.Icon>
      <ChatSystemMessage.Content>Ada se unió a la conversación.</ChatSystemMessage.Content>
      <ChatSystemMessage.Timestamp>10:45 AM</ChatSystemMessage.Timestamp>
    </ChatSystemMessage.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-system-message`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-system-message expone 4 partes:

- **Root** — `data-part="root"`. Contenedor que usa `role=status` con `aria-live=polite`; admite mensajes tipados (info, warning, error, join, leave).
- **Icon** — `data-part="icon"`. Muestra un icono que refleja el tipo de mensaje.
- **Content** — `data-part="content"`. Contiene el anuncio.
- **Timestamp** — `data-part="timestamp"`. Muestra la hora del mensaje.

## Estilos

chat-system-message incluye los atributos `data-scope="chat-system-message"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Chat System Message se compone dentro de diseños y listas de mensajes junto con primitivos de mensajes de chat para comunicar eventos del sistema y del bot.

## SSR e hidratación

Chat System Message renderiza HTML estático en el servidor; su región `aria-live` anuncia las actualizaciones cuando cambia el contenido después de la hidratación.
