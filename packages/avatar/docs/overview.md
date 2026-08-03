---
contentSchemaVersion: 1
title: Avatar
description: User avatar with image and fallback support.
keywords: [avatar, image, fallback, initials, user]
locale: en
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: overview
---

Avatar renders a user profile image with automatic fallback to text content (such as initials or a name) when the image fails to load. It manages image loading state internally and coordinates visibility between the image and fallback parts.

## Usage

Avatar has three composable parts: `Root`, `Image`, and `Fallback`. Always provide both an `Image` and a `Fallback` inside `Root`.

```tsx
import * as Avatar from "@solidiom/avatar"

;<Avatar.Root>
  <Avatar.Image src="/user-photo.jpg" alt="Photo of Jane Doe" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

## Installation

Install the package with `pnpm add @solidiom/avatar`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

### Root

Container that manages image loading state for its child `Image` and `Fallback` parts.

| Prop    | Type     | Default | Description                     |
| ------- | -------- | ------- | ------------------------------- |
| `class` | `string` | —       | CSS class for the root element. |

### Image

Renders an `<img>` element that is hidden until the image loads successfully. Reports loading state to the `Root`.

| Prop    | Type     | Default | Description                      |
| ------- | -------- | ------- | -------------------------------- |
| `src`   | `string` | —       | URL of the avatar image.         |
| `alt`   | `string` | —       | Alternative text for the image.  |
| `class` | `string` | —       | CSS class for the image element. |

### Fallback

Renders fallback content (e.g., initials, icon) when the image has not loaded or has errored. Hidden when the image is successfully loaded.

| Prop       | Type          | Default | Description                                         |
| ---------- | ------------- | ------- | --------------------------------------------------- |
| `children` | `JSX.Element` | —       | Content to display when the image is not available. |
| `class`    | `string`      | —       | CSS class for the fallback element.                 |

## Styling

Avatar carries `data-scope="avatar"` and `data-part` attributes for targeting each part:

- `Root`: `data-scope="avatar"`, `data-part="root"` — renders as a `<span>`
- `Image`: `data-scope="avatar"`, `data-part="image"` — renders as an `<img>`
- `Fallback`: `data-scope="avatar"`, `data-part="fallback"` — renders as a `<span>`

Style the root as a flex container to overlay the image and fallback. Use the `data-part` attributes to target individual parts.

## SSR and hydration

Avatar manages image loading state client-side. On the server, the `Image` is hidden and the `Fallback` is visible. After hydration, the image loads and replaces the fallback. No manual state management is required.
