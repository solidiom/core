---
contentSchemaVersion: 1
title: Basic avatar
description: Avatar component with image and fallback examples.
keywords: [avatar, image, user, component, primitive]
locale: en
maturity: draft
product: Avatar
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "avatar"
section: examples
exampleId: avatar-component-basic
source:
  path: apps/site/src/components/AvatarExample.tsx
  export: AvatarExample
  language: tsx
runnable: true
---

The Avatar component is a styled recipe wrapper around the `@solidiom/avatar` primitive. It provides a circular image display with automatic fallback when the image fails to load.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/avatar.jpg" alt="Jane Doe" fallback="JD" />
```

## With fallback only

Render a fallback avatar without an image source.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar fallback="JD">JD</StyledAvatar>
```

## With custom fallback content

Provide custom children as the fallback display.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/avatar.jpg" alt="Jane Doe">
  <span>JD</span>
</StyledAvatar>
```