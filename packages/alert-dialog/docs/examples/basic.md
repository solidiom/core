---
contentSchemaVersion: 1
title: Alert Dialog - Basic usage
description: Basic alert dialog example demonstrating core behavior.
keywords: [alert-dialog, basic, example]
locale: en
maturity: draft
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: examples
exampleId: alert-dialog-basic
source:
  path: packages/alert-dialog/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as AlertDialog from "@solidiom/alert-dialog"

;<>
  <AlertDialog.Root defaultOpen={false} onOpenChange={(open) => console.log(open)}>
    <AlertDialog.Trigger>Delete Account</AlertDialog.Trigger>

    <AlertDialog.Portal>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete your account?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. All your data will be permanently removed.
        </AlertDialog.Description>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action onAction={() => console.log("Account deleted")}>
            Delete
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</>
```

Unlike a regular dialog, the alert dialog does not dismiss on click-outside or Escape key. The user must explicitly click either the Cancel or Action button to close it.
