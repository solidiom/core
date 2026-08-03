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
notApplicable:
  - section: relationships
    reason: Dialog has no sibling primitives. It composes internally with Portal and Backdrop but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive. Focus-trap and keyboard behavior are documented in the Keyboard section.
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

## Parts

Dialog exposes seven parts:

- **Root** — state container managing open/closed, modal/non-modal, and controlled/uncontrolled modes.
- **Trigger** — the button that opens the dialog. Carries `aria-haspopup="dialog"` and `aria-expanded`.
- **Portal** — renders children into `document.body` to escape overflow/z-index constraints.
- **Backdrop** — a full-viewport overlay behind the content. Clicking it dismisses the dialog in modal mode.
- **Content** — the dialog panel. Receives `role="dialog"`, `aria-modal`, `aria-labelledby`, and `aria-describedby`.
- **Title** — the visible heading, connected to Content via `aria-labelledby`.
- **Description** — optional explanatory text, connected via `aria-describedby`.
- **Close** — a button that dismisses the dialog.

## Styling

Dialog ships with CSS, Tailwind, and UnoCSS recipe outputs. Parts carry `data-scope="dialog"` and `data-part` attributes. The Content part exposes `data-state="open"` or `data-state="closed"` for entry/exit animations. The Backdrop uses `data-part="backdrop"` with the same state attribute.

## Keyboard & behavior

| Key       | Behavior                                                                             |
| --------- | ------------------------------------------------------------------------------------ |
| Escape    | Closes the dialog and restores focus to the trigger.                                 |
| Tab       | Moves focus to the next focusable element within the dialog (trapped in modal mode). |
| Shift+Tab | Moves focus backwards within the dialog content.                                     |

Focus is trapped inside the dialog when `modal` is true. On open, focus moves to the first focusable element inside Content. On close, focus returns to Trigger.

## Composition

Dialog is designed to compose with other primitives. Use a `Field` inside Content for form workflows, `Button` for confirm/cancel actions, or nest an `Alert` for inline warnings within the dialog body.

## SSR and hydration

Dialog renders as hidden HTML during SSR — Content is not present in the initial DOM unless `defaultOpen` is set. Hydration attaches event listeners and focus-trap logic. The `Portal` renders only on the client to avoid server/client markup mismatch.
