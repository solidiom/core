---
contentSchemaVersion: 1
title: Message Scroller
description: Auto-scrolling message container with new-content indicators.
keywords: [message, scroller, auto-scroll, scroll anchor, indicator, container, utility]
locale: en
maturity: ga
product: Message Scroller
productLayer: primitive
status: draft
package: "@solidiom/message-scroller"
primitive: message-scroller
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Message Scroller is an auto-scrolling message container with new-content indicators. It uses `createScrollAnchor` to manage auto-scroll and exposes `isAtBottom`, `hasNewContent`, and `newContentCount` via context. The NewContentIndicator appears when new content arrives while scrolled up.

## Usage

Compose `Root`, `ScrollArea`, and `NewContentIndicator`.

```tsx
import * as MessageScroller from "@solidiom/message-scroller"

function Scroller() {
  return (
    <MessageScroller.Root>
      <MessageScroller.ScrollArea>{/* messages */}</MessageScroller.ScrollArea>
      <MessageScroller.NewContentIndicator>New messages</MessageScroller.NewContentIndicator>
    </MessageScroller.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/message-scroller`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

message-scroller exposes 3 parts:

- **Root** — `data-part="root"`. Container that manages auto-scroll via a scroll anchor and exposes `isAtBottom`, `hasNewContent`, and `newContentCount` via context.
- **ScrollArea** — `data-part="scrollarea"`. Scrollable region holding the messages.
- **NewContentIndicator** — `data-part="newcontentindicator"`. Appears when new content arrives while scrolled up.

## Styling

message-scroller carries `data-scope="message-scroller"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Message Scroller composes around chat message lists and other streaming content to manage auto-scroll and surface new-content indicators.

## SSR and hydration

Message Scroller renders its structure on the server and activates scroll-anchor management and new-content tracking on hydration.
