---
contentSchemaVersion: 1
title: Toast - Basic usage
description: Basic toast example demonstrating core behavior.
keywords: [toast, basic, example]
locale: en
maturity: draft
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: examples
exampleId: toast-basic
source:
  path: packages/toast/src/index.tsx
  export: Region
  language: tsx
runnable: false
runnableReason: "Runnable island to be created when this primitive is fully retrofitted."
---

```tsx
import * as Toast from "@solidiom/toast"
import { createEffect } from "solid-js"

const toaster = Toast.createToaster({ max: 3, defaultDuration: 5000 })

;<div>
  <button onClick={() => toaster.toast({
    title: "Saved",
    description: "Your changes have been saved.",
  })}>
    Show toast
  </button>

  <Toast.Region toaster={toaster}>
    {(toasts) =>
      toasts().map((entry) => (
        <Toast.Root toastId={entry.id}>
          <Toast.Title>{entry.title}</Toast.Title>
          {entry.description && (
            <Toast.Description>{entry.description}</Toast.Description>
          )}
          <Toast.Close>×</Toast.Close>
        </Toast.Root>
      ))
    }
  </Toast.Region>
</div>
```

The `createToaster` function returns a `{ toast, dismiss, toasts }` API for programmatic queue management. The Region handles auto-dismiss timers and pause-on-hover. Omit the `children` render function for default rendering with Title, Description, and Close.
