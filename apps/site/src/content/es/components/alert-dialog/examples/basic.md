---
contentSchemaVersion: 1
title: Diálogo de alerta básico
description: Componente de diálogo de alerta para confirmar acciones críticas.
keywords: [alert-dialog, modal, confirmation, dialog]
locale: es
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
translationSourceHash: "059baee864a188a0ac467cec62a8291e35d3bfa1f5ecbf3f9ed0de1ea9c30fef"
translationStatus: draft
---

El componente Alert Dialog es un diálogo modal para confirmar acciones críticas.

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
      <AlertDialog.Cancel>
        <button type="button">Cancel</button>
      </AlertDialog.Cancel>
      <AlertDialog.Action>
        <button type="button">Delete</button>
      </AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```
