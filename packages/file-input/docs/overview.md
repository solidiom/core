---
contentSchemaVersion: 1
title: File Input
description: File upload trigger with dropzone support and validation.
keywords: [file input, upload, dropzone, drag and drop, validation, file list]
locale: en
maturity: ga
product: File Input
productLayer: primitive
status: draft
package: "@solidiom/file-input"
primitive: file-input
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

File Input provides a file upload trigger with drag-and-drop dropzone support and validation. It supports click-to-browse via the Trigger, drag-and-drop uploads via `createDropzone`, and validates files by type, size, and count. File lists can be controlled or uncontrolled.

## Usage

Compose `Root`, `Trigger`, `HiddenInput`, `FileList`, `FileItem`, and `FileRemove`. `HiddenInput` is the native `<input type="file">`, and the Trigger provides click-to-browse.

```tsx
import * as FileInput from "@solidiom/file-input"

;<FileInput.Root>
  <FileInput.Trigger>Choose files</FileInput.Trigger>
  <FileInput.HiddenInput />
  <FileInput.FileList>
    <FileInput.FileItem>
      <FileInput.FileRemove>Remove</FileInput.FileRemove>
    </FileInput.FileItem>
  </FileInput.FileList>
</FileInput.Root>
```

## Installation

Install the package with `pnpm add @solidiom/file-input`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

file-input exposes 6 parts:

- **Root** — the container that manages the file list, dropzone, and validation (type, size, count).
- **Trigger** — the click-to-browse control that opens the file picker.
- **HiddenInput** — the native `<input type="file">`.
- **FileList** — the container rendering the selected files.
- **FileItem** — a single selected file entry.
- **FileRemove** — the control that removes its associated file from the list.

## Styling

file-input carries `data-scope="file-input"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

The Trigger opens the native file browser via click activation, and files can be added by dragging onto the dropzone. File validation enforces type, size, and count. The file list supports controlled and uncontrolled usage.

## Composition

Compose with buttons, icons, or field primitives to build a complete upload control; the HiddenInput handles native form participation.

## SSR and hydration

The structure renders as static HTML on the server; the dropzone handlers and Trigger activate on hydration on the client.
