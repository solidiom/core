---
contentSchemaVersion: 1
title: Dialog
description: Present modal or non-modal content that requires a focused interaction.
keywords: [modal, overlay, focus]
locale: en
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: overview
---

Dialog presents contextual content above the current page. Use it when a focused decision or short workflow should interrupt the current task.

## Usage

Compose `Root`, `Trigger`, `Portal`, `Backdrop`, and `Content`. A modal dialog should include a `Title` and a concise `Description` so assistive technology can announce its purpose.

```tsx
import * as Dialog from "@solidiom/dialog"

;<Dialog.Root>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Content>
      <Dialog.Title>Dialog title</Dialog.Title>
      <Dialog.Description>Explain the decision or next step.</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Use `modal={false}` only when background interaction remains appropriate. Do not use a Dialog for information that belongs in the normal document flow.

## Installation

Install the package with `pnpm add @solidiom/dialog`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.
