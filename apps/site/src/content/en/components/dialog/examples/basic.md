---
contentSchemaVersion: 1
title: Basic dialog
description: Dialog component with trigger, title, description, and content.
keywords: [dialog, modal, overlay, popup]
locale: en
maturity: draft
product: Dialog
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "dialog"
section: examples
exampleId: dialog-component-basic
source:
  path: apps/site/src/components/DialogExample.tsx
  export: DialogExample
  language: tsx
runnable: true
---

The Dialog component is a styled recipe wrapper around the `@solidiom/dialog` primitive. It adds composition, semantic styling slots, and controlled open state while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { createSignal } from "solid-js"
import { StyledDialog } from "@solidiom/recipes-css"

export function DialogExample() {
  const [open, setOpen] = createSignal(false)

  return (
    <StyledDialog
      trigger={<button class="solidiom-btn">Open Dialog</button>}
      title="Confirm action"
      description="Are you sure you want to continue?"
      open={open}
      onOpenChange={setOpen}
    >
      <div class="flex justify-end gap-2 mt-4">
        <button class="solidiom-btn solidiom-btn--variant-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button class="solidiom-btn solidiom-btn--variant-primary" onClick={() => setOpen(false)}>
          Confirm
        </button>
      </div>
    </StyledDialog>
  )
}
```

## Controlled open state

Use `createSignal` to manage the dialog's open state. Pass the signal's getter as `open` and the setter as `onOpenChange` to enable controlled open/close behavior.

## Content area

The `children` prop renders inside the dialog content area, below the title and description. Use it to add forms, confirmation buttons, or any custom content.
