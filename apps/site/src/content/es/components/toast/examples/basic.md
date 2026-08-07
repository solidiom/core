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
translationSourceHash: "76102a7d176818a986e704d48ebd987137df6708f8d40e0b310e5458c5100125"
translationStatus: draft
---

The Toast component is a styled recipe wrapper around the `@solidiom/toast` primitive. It provides a notification queue with auto-dismiss, pause-on-hover, configurable max visible toasts, and programmatic control through `createToaster()`.

```tsx
import { StyledToast, Toast } from "@solidiom/recipes-css"
import { createToaster } from "@solidiom/toast"

const { toast, regionProps } = createToaster({ max: 3 })

;<div>
  <Toast.Region {...regionProps} />
  <button onClick={() => toast({ title: "Success", description: "Changes saved." })}>
    Show toast
  </button>
</div>
```

## With variants

Toasts support the info, success, warning, and error variants for visual distinction.

```tsx
import { StyledToast, Toast } from "@solidiom/recipes-css"
import { createToaster } from "@solidiom/toast"

const { toast, regionProps } = createToaster()

;<div>
  <Toast.Region {...regionProps} />
  <button onClick={() => toast({ title: "Error", description: "Operation failed.", variant: "error" })}>
    Show error toast
  </button>
</div>
```