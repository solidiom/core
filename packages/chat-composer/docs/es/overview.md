---
contentSchemaVersion: 1
title: Chat Composer
description: Entrada de texto enriquecido para redactar mensajes de chat con acción de envío.
keywords: [chat, composer, input, textarea, send, message, form]
locale: es
maturity: ga
product: Chat Composer
productLayer: primitive
status: draft
package: "@solidiom/chat-composer"
primitive: chat-composer
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "4a0655afc7d3bb9118ab5571f01e6c7f38e74fa8cedd8aacc5c806809c9d6281"
translationStatus: "draft"
---

Chat Composer es una entrada de texto enriquecido para redactar mensajes de chat con una acción de envío. Root es un `<form>` que gestiona el envío, Input es un `<textarea>` que crece automáticamente y envía al pulsar Enter (Shift+Enter inserta un salto de línea), y SendButton se deshabilita cuando está vacío.

## Uso

Compón `Root`, `Input`, `SendButton` y `AttachButton`.

```tsx
import * as ChatComposer from "@solidiom/chat-composer"

function Composer() {
  return (
    <ChatComposer.Root>
      <ChatComposer.AttachButton>Adjuntar</ChatComposer.AttachButton>
      <ChatComposer.Input placeholder="Escribe un mensaje" />
      <ChatComposer.SendButton>Enviar</ChatComposer.SendButton>
    </ChatComposer.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-composer`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-composer expone 4 partes:

- **Root** — `data-part="root"`. Un `<form>` que gestiona el envío.
- **Input** — `data-part="input"`. Un `<textarea>` que crece automáticamente y envía con Enter (Shift+Enter inserta un salto de línea).
- **SendButton** — `data-part="sendbutton"`. Envía el mensaje redactado; se deshabilita cuando la entrada está vacía.
- **AttachButton** — `data-part="attachbutton"`. Control para adjuntar contenido al mensaje.

## Estilos

chat-composer incluye los atributos `data-scope="chat-composer"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

| Tecla       | Comportamiento             |
| ----------- | -------------------------- |
| Enter       | Envía el mensaje.          |
| Shift+Enter | Inserta un salto de línea. |

## Composición

Chat Composer se compone como superficie de entrada dentro de diseños y flujos de chat, junto con primitivos de lista de mensajes.

## SSR e hidratación

Chat Composer renderiza las marcas de su formulario en el servidor y activa el envío, el crecimiento automático y los manejadores de teclado durante la hidratación.
