---
contentSchemaVersion: 1
title: Chat Tool Calls
description: Visualización de resultados de llamadas a herramientas o funciones en interfaces de chat con IA.
keywords: [chat, tool, function, call, disclosure, status, ai]
locale: es
maturity: ga
product: Chat Tool Calls
productLayer: primitive
status: draft
package: "@solidiom/chat-tool-calls"
primitive: chat-tool-calls
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "c32da1d8fc1098f589f11917bf26bc5e51d93f26f6d7e62e97465176cec98c5a"
translationStatus: "draft"
---

Chat Tool Calls muestra resultados de llamadas a herramientas o funciones en interfaces de chat con IA. ToolInput y ToolOutput son secciones contraíbles mediante `createDisclosureState`, y cada ToolCall registra el estado pending, running, success o error.

## Uso

Compón `Root`, `ToolCall`, `ToolName`, `ToolInput`, `ToolOutput` y `ToolStatus`.

```tsx
import * as ChatToolCalls from "@solidiom/chat-tool-calls"

function ToolCalls() {
  return (
    <ChatToolCalls.Root>
      <ChatToolCalls.ToolCall>
        <ChatToolCalls.ToolName>search_docs</ChatToolCalls.ToolName>
        <ChatToolCalls.ToolStatus>success</ChatToolCalls.ToolStatus>
        <ChatToolCalls.ToolInput>{`{ "query": "hydration" }`}</ChatToolCalls.ToolInput>
        <ChatToolCalls.ToolOutput>Se encontraron 3 resultados.</ChatToolCalls.ToolOutput>
      </ChatToolCalls.ToolCall>
    </ChatToolCalls.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chat-tool-calls`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chat-tool-calls expone 6 partes:

- **Root** — `data-part="root"`. Contenedor del conjunto de llamadas a herramientas.
- **ToolCall** — `data-part="toolcall"`. Una llamada individual; registra el estado (pending, running, success, error).
- **ToolName** — `data-part="toolname"`. Muestra el nombre de la herramienta o función.
- **ToolInput** — `data-part="toolinput"`. Sección contraíble que muestra la entrada de la herramienta.
- **ToolOutput** — `data-part="tooloutput"`. Sección contraíble que muestra la salida de la herramienta.
- **ToolStatus** — `data-part="toolstatus"`. Muestra el estado actual de la llamada.

## Estilos

chat-tool-calls incluye los atributos `data-scope="chat-tool-calls"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no documenta interacción de teclado propia más allá de alternar las secciones contraíbles ToolInput y ToolOutput mediante sus controles de disclosure.

## Composición

Chat Tool Calls se compone dentro de flujos de mensajes para mostrar la actividad de llamadas a herramientas o funciones de asistentes de IA.

## SSR e hidratación

Chat Tool Calls renderiza marcas estáticas en el servidor; el estado de disclosure de ToolInput y ToolOutput se activa durante la hidratación.
