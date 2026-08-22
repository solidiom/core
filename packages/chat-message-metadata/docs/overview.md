---
contentSchemaVersion: 1
title: Chat Message Metadata
description: Timestamps, read receipts, and sender info for chat messages.
keywords: [chat, metadata, timestamp, sender, status, receipt, message]
locale: en
maturity: ga
product: Chat Message Metadata
productLayer: primitive
status: draft
package: "@solidiom/chat-message-metadata"
primitive: chat-message-metadata
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat Message Metadata renders timestamps, read receipts, and sender info for chat messages. It provides structured metadata with semantic time elements and delivery status indicators.

## Usage

Compose `Root`, `Timestamp`, `Sender`, and `Status`.

```tsx
import * as ChatMessageMetadata from "@solidiom/chat-message-metadata"

function Metadata() {
  return (
    <ChatMessageMetadata.Root>
      <ChatMessageMetadata.Sender>Ada</ChatMessageMetadata.Sender>
      <ChatMessageMetadata.Timestamp>10:42 AM</ChatMessageMetadata.Timestamp>
      <ChatMessageMetadata.Status>Read</ChatMessageMetadata.Status>
    </ChatMessageMetadata.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-message-metadata`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-message-metadata exposes 4 parts:

- **Root** — `data-part="root"`. Container for the structured metadata.
- **Timestamp** — `data-part="timestamp"`. Renders a semantic time element for the message time.
- **Sender** — `data-part="sender"`. Displays sender information.
- **Status** — `data-part="status"`. Delivery status indicator.

## Styling

chat-message-metadata carries `data-scope="chat-message-metadata"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Chat Message Metadata composes within chat message primitives to annotate individual messages with timing and delivery information.

## SSR and hydration

Chat Message Metadata renders static HTML and needs no hydration, as it is a structural/display primitive.
