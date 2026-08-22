---
contentSchemaVersion: 1
title: Avatar Group
description: Stacked avatar display for showing multiple users.
keywords: [avatar, group, stack, users, overflow, avatars, presence]
locale: en
maturity: ga
product: Avatar Group
productLayer: primitive
status: draft
package: "@solidiom/avatar-group"
primitive: avatar-group
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Avatar Group provides a stacked avatar display for showing multiple users. It renders avatars in an overlapping arrangement with an overflow indicator when the number of avatars exceeds the visible limit.

## Usage

Compose `Root` and `Overflow`.

```tsx
import * as AvatarGroup from "@solidiom/avatar-group"

function TeamAvatars() {
  return (
    <AvatarGroup.Root>
      <img src="/users/ada.png" alt="Ada" />
      <img src="/users/linus.png" alt="Linus" />
      <img src="/users/grace.png" alt="Grace" />
      <AvatarGroup.Overflow>+3</AvatarGroup.Overflow>
    </AvatarGroup.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/avatar-group`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

avatar-group exposes 2 parts:

- **Root** — `data-part="root"`. Container that arranges avatars in a stacked, overlapping layout.
- **Overflow** — `data-part="overflow"`. Overflow indicator shown when the number of avatars exceeds the visible limit.

## Styling

avatar-group carries `data-scope="avatar-group"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Avatar Group composes naturally with individual avatar primitives or plain image elements as children, and can sit within cards, lists, or headers.

## SSR and hydration

Avatar Group renders static HTML and needs no hydration, as it is a purely structural/display primitive.
