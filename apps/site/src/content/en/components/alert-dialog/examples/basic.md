---
contentSchemaVersion: 1
title: Basic alert dialog
description: Alert dialog component for confirming critical actions.
keywords: [alert-dialog, modal, confirmation, dialog]
locale: en
maturity: draft
product: AlertDialog
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "alert-dialog"
section: examples
exampleId: alert-dialog-component-basic
source:
  path: apps/site/src/components/AlertDialogExample.tsx
  export: AlertDialogExample
  language: tsx
runnable: true
---

The Alert Dialog component is a modal dialog for confirming critical actions.

```tsx
import { StyledAlertDialog, AlertDialog } from "@solidiom/recipes-css"

;<AlertDialog.Root>
  <AlertDialog.Trigger>
    <button type="button">Delete account</button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Content>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
      <AlertDialog.Cancel><button type="button">Cancel</button></AlertDialog.Cancel>
      <AlertDialog.Action><button type="button">Delete</button></AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```
