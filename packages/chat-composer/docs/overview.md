---
contentSchemaVersion: 1
title: Chat Composer
description: Rich text input for composing chat messages with send action.
keywords: [chat, composer, input, textarea, send, message, form]
locale: en
maturity: ga
product: Chat Composer
productLayer: primitive
status: draft
package: "@solidiom/chat-composer"
primitive: chat-composer
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Chat Composer is a rich text input for composing chat messages with a send action. Root is a `<form>` handling submit, Input is a `<textarea>` that auto-grows and submits on Enter (Shift+Enter for newline), and SendButton is disabled when empty.

## Usage

Compose `Root`, `Input`, `SendButton`, and `AttachButton`.

```tsx
import * as ChatComposer from "@solidiom/chat-composer"

function Composer() {
  return (
    <ChatComposer.Root>
      <ChatComposer.AttachButton>Attach</ChatComposer.AttachButton>
      <ChatComposer.Input placeholder="Type a message" />
      <ChatComposer.SendButton>Send</ChatComposer.SendButton>
    </ChatComposer.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/chat-composer`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

chat-composer exposes 4 parts:

- **Root** — `data-part="root"`. A `<form>` that handles submit.
- **Input** — `data-part="input"`. A `<textarea>` that auto-grows and submits on Enter (Shift+Enter for newline).
- **SendButton** — `data-part="sendbutton"`. Submits the composed message; disabled when the input is empty.
- **AttachButton** — `data-part="attachbutton"`. Control for attaching content to the message.

## Styling

chat-composer carries `data-scope="chat-composer"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

| Key         | Behavior             |
| ----------- | -------------------- |
| Enter       | Submits the message. |
| Shift+Enter | Inserts a newline.   |

## Composition

Chat Composer composes as the input surface within chat layouts and message flows, pairing with message list primitives above it.

## SSR and hydration

Chat Composer renders its form markup on the server and activates submit, auto-grow, and keyboard handlers on hydration.
