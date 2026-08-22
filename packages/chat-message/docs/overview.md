---
contentSchemaVersion: 1
title: Chat Message
description: Message bubble for conversational UI with sender, content, and metadata.
keywords: [chat, message, bubble, sender, avatar, content, conversation]
locale: en
maturity: ga
product: Chat Message
productLayer: primitive
status: draft
package: "@solidiom/chat-message"
primitive: chat-message
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat Message is a message bubble for conversational UI with sender, content, and metadata. It provides an accessible chat message structure with variant support for sent/received messages, an avatar slot, and action containers.

## Usage

Compose `Root`, `Content`, `Avatar`, and `Actions`.

```tsx
import * as ChatMessage from "@solidiom/chat-message"

function Message() {
  return (
    <ChatMessage.Root>
      <ChatMessage.Avatar>
        <img src="/users/ada.png" alt="Ada" />
      </ChatMessage.Avatar>
      <ChatMessage.Content>Hey, are we still on for today?</ChatMessage.Content>
      <ChatMessage.Actions>
        <button>Reply</button>
      </ChatMessage.Actions>
    </ChatMessage.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-message`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-message exposes 4 parts:

- **Root** — `data-part="root"`. Message bubble container with variant support for sent/received messages.
- **Content** — `data-part="content"`. Holds the message content.
- **Avatar** — `data-part="avatar"`. Avatar slot for the sender.
- **Actions** — `data-part="actions"`. Container for message actions.

## Styling

chat-message carries `data-scope="chat-message"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Chat Message composes within chat layouts and message lists, pairing with metadata and system message primitives.

## SSR and hydration

Chat Message renders static HTML and needs no hydration, as it is a structural/display primitive.
