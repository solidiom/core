---
contentSchemaVersion: 1
title: Basic toast
description: Toast component with programmatic queue and variant examples.
keywords: [toast, notification, feedback, queue, primitive]
locale: es
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
translationSourceHash: "e60cb3d04edb3707f96582a91360346a95e61f2b451da4201dca7b50c40d1768"
translationStatus: draft
---

El componente Toast proporciona notificaciones no bloqueantes que aparecen temporalmente y se cierran automáticamente.

```tsx
import { StyledToast, Toast } from "@solidiom/recipes-css"

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
