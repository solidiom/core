---
contentSchemaVersion: 1
title: Basic toast
description: Toast component with programmatic queue and variant examples.
keywords: [toast, notification, feedback, queue, primitive]
locale: en
maturity: draft
product: Toast
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "toast"
section: examples
exampleId: toast-component-basic
source:
  path: apps/site/src/components/ToastExample.tsx
  export: ToastExample
  language: tsx
  runnable: true
---

The Toast component provides non-blocking notifications that appear temporarily and auto-dismiss.

```tsx
import { StyledToast } from "@solidiom/recipes-css"
import * as Toast from "@solidiom/toast"

const toaster = Toast.createToaster({ max: 3 })

;<Toast.Region toaster={toaster}>
  {(toasts) =>
    toasts().map((entry) => (
      <Toast.Root toastId={entry.id}>
        <Toast.Title>{entry.title}</Toast.Title>
        <Toast.Description>{entry.description}</Toast.Description>
        <Toast.Close>Dismiss</Toast.Close>
      </Toast.Root>
    ))
  }
</Toast.Region>
```
