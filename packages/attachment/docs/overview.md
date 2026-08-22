---
contentSchemaVersion: 1
title: Attachment
description: File attachment display with preview, name, and size.
keywords: [attachment, file, preview, upload, download]
locale: en
maturity: ga
product: Attachment
productLayer: primitive
status: draft
package: "@solidiom/attachment"
primitive: attachment
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Attachment displays a single file attachment with its metadata and actions — a preview thumbnail, file name, size, and a remove control.

## Usage

Compose `Root`, `Preview`, `Name`, `Size`, `Remove`, and `Icon`.

```tsx
import * as Attachment from "@solidiom/attachment"

;<Attachment.Root>
  <Attachment.Preview>
    <Attachment.Icon />
  </Attachment.Preview>
  <Attachment.Name>report.pdf</Attachment.Name>
  <Attachment.Size>2.4 MB</Attachment.Size>
  <Attachment.Remove />
</Attachment.Root>
```

## Installation

Install the package with `pnpm add @solidiom/attachment`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Attachment exposes 6 parts:

- **Root** — `data-part="root"`. Container for one attachment.
- **Preview** — `data-part="preview"`. Thumbnail or preview region.
- **Name** — `data-part="name"`. File name.
- **Size** — `data-part="size"`. Formatted file size.
- **Remove** — `data-part="remove"`. Button to remove the attachment.
- **Icon** — `data-part="icon"`. File-type icon slot.

## Styling

Attachment carries `data-scope="attachment"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

The `Remove` part is a button and is keyboard operable (Enter/Space). Other parts are display-only.

## Composition

Attachment composes with `File Input` to render selected files, and with `Button` or `Icon` content inside its action slots.

## SSR and hydration

Attachment renders as semantic HTML during server rendering. Only the `Remove` action requires client-side hydration for its click handler.
