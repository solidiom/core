---
contentSchemaVersion: 1
title: Chat Tool Calls
description: Display of tool/function call results in AI chat interfaces.
keywords: [chat, tool, function, call, disclosure, status, ai]
locale: en
maturity: ga
product: Chat Tool Calls
productLayer: primitive
status: draft
package: "@solidiom/chat-tool-calls"
primitive: chat-tool-calls
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat Tool Calls displays tool/function call results in AI chat interfaces. ToolInput and ToolOutput are collapsible sections (via `createDisclosureState`), and each ToolCall tracks status: pending, running, success, or error.

## Usage

Compose `Root`, `ToolCall`, `ToolName`, `ToolInput`, `ToolOutput`, and `ToolStatus`.

```tsx
import * as ChatToolCalls from "@solidiom/chat-tool-calls"

function ToolCalls() {
  return (
    <ChatToolCalls.Root>
      <ChatToolCalls.ToolCall>
        <ChatToolCalls.ToolName>search_docs</ChatToolCalls.ToolName>
        <ChatToolCalls.ToolStatus>success</ChatToolCalls.ToolStatus>
        <ChatToolCalls.ToolInput>{`{ "query": "hydration" }`}</ChatToolCalls.ToolInput>
        <ChatToolCalls.ToolOutput>3 results found.</ChatToolCalls.ToolOutput>
      </ChatToolCalls.ToolCall>
    </ChatToolCalls.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-tool-calls`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-tool-calls exposes 6 parts:

- **Root** — `data-part="root"`. Container for the set of tool calls.
- **ToolCall** — `data-part="toolcall"`. A single tool call; tracks status (pending, running, success, error).
- **ToolName** — `data-part="toolname"`. Displays the tool/function name.
- **ToolInput** — `data-part="toolinput"`. Collapsible section showing the tool input.
- **ToolOutput** — `data-part="tooloutput"`. Collapsible section showing the tool output.
- **ToolStatus** — `data-part="toolstatus"`. Displays the current tool call status.

## Styling

chat-tool-calls carries `data-scope="chat-tool-calls"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no dedicated keyboard interaction documented beyond toggling the ToolInput and ToolOutput collapsible sections via their disclosure controls.

## Composition

Chat Tool Calls composes within chat message flows to surface tool/function call activity from AI assistants.

## SSR and hydration

Chat Tool Calls renders static markup on the server; the ToolInput and ToolOutput disclosure state activates on hydration.
