---
contentSchemaVersion: 1
title: Chat Layout
description: Container managing message flow, scroll behavior, and composer positioning.
keywords: [chat, layout, container, scroll, composer, header, messages]
locale: en
maturity: ga
product: Chat Layout
productLayer: primitive
status: draft
package: "@solidiom/chat-layout"
primitive: chat-layout
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat Layout is a container managing message flow, scroll behavior, and composer positioning. It is a purely structural flex column filling height with a scrollable message area, plus fixed header and bottom composer sections.

## Usage

Compose `Root`, `MessageList`, `Composer`, and `Header`.

```tsx
import * as ChatLayout from "@solidiom/chat-layout"

function Conversation() {
  return (
    <ChatLayout.Root>
      <ChatLayout.Header>Support</ChatLayout.Header>
      <ChatLayout.MessageList>{/* messages */}</ChatLayout.MessageList>
      <ChatLayout.Composer>{/* composer */}</ChatLayout.Composer>
    </ChatLayout.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-layout`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-layout exposes 4 parts:

- **Root** — `data-part="root"`. Flex column that fills height and arranges the layout sections.
- **MessageList** — `data-part="messagelist"`. Scrollable message area.
- **Composer** — `data-part="composer"`. Fixed bottom composer section.
- **Header** — `data-part="header"`. Fixed header section.

## Styling

chat-layout carries `data-scope="chat-layout"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Chat Layout composes with chat message, composer, and header primitives placed into its structural sections.

## SSR and hydration

Chat Layout renders static HTML and needs no hydration, as it is a purely structural primitive.
