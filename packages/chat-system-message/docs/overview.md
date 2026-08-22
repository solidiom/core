---
contentSchemaVersion: 1
title: Chat System Message
description: System and bot announcement messages in conversations.
keywords: [chat, system, announcement, status, aria-live, bot, message]
locale: en
maturity: ga
product: Chat System Message
productLayer: primitive
status: draft
package: "@solidiom/chat-system-message"
primitive: chat-system-message
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat System Message renders system and bot announcement messages in conversations. It uses `role=status` with `aria-live=polite` for accessible announcements and supports typed messages: info, warning, error, join, and leave.

## Usage

Compose `Root`, `Icon`, `Content`, and `Timestamp`.

```tsx
import * as ChatSystemMessage from "@solidiom/chat-system-message"

function SystemNotice() {
  return (
    <ChatSystemMessage.Root>
      <ChatSystemMessage.Icon>ℹ️</ChatSystemMessage.Icon>
      <ChatSystemMessage.Content>Ada joined the conversation.</ChatSystemMessage.Content>
      <ChatSystemMessage.Timestamp>10:45 AM</ChatSystemMessage.Timestamp>
    </ChatSystemMessage.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-system-message`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-system-message exposes 4 parts:

- **Root** — `data-part="root"`. Container using `role=status` with `aria-live=polite`; supports typed messages (info, warning, error, join, leave).
- **Icon** — `data-part="icon"`. Displays an icon reflecting the message type.
- **Content** — `data-part="content"`. Holds the announcement content.
- **Timestamp** — `data-part="timestamp"`. Displays the message time.

## Styling

chat-system-message carries `data-scope="chat-system-message"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Chat System Message composes within chat layouts and message lists alongside chat message primitives to convey system and bot events.

## SSR and hydration

Chat System Message renders static HTML on the server; its `aria-live` region announces updates as content changes after hydration.
