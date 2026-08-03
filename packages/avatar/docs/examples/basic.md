---
contentSchemaVersion: 1
title: Basic avatar
description: Avatar with image and text fallback examples.
keywords: [avatar, image, fallback, initials, user]
locale: en
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: examples
exampleId: avatar-basic
source:
  path: packages/avatar/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Avatar from "@solidiom/avatar"

;<Avatar.Root>
  <Avatar.Image src="/avatars/jane-doe.jpg" alt="Photo of Jane Doe" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

## With full name fallback

Use the user's name as fallback content for better identification when the image is unavailable.

```tsx
;<Avatar.Root>
  <Avatar.Image src="/avatars/jane-doe.jpg" alt="Photo of Jane Doe" />
  <Avatar.Fallback>Jane Doe</Avatar.Fallback>
</Avatar.Root>
```

## Stacked avatars

Combine multiple avatars in a group for team displays or comment threads.

```tsx
;<div style={{ display: "flex", gap: "8px" }}>
  <Avatar.Root>
    <Avatar.Image src="/users/1.jpg" alt="User 1" />
    <Avatar.Fallback>A</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/users/2.jpg" alt="User 2" />
    <Avatar.Fallback>B</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/users/3.jpg" alt="User 3" />
    <Avatar.Fallback>C</Avatar.Fallback>
  </Avatar.Root>
</div>
```