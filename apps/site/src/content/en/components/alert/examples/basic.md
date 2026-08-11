---
contentSchemaVersion: 1
title: Basic alert
description: Alert component with info, success, warning, and error variants.
keywords: [alert, notification, feedback, variant]
locale: en
maturity: draft
product: Alert
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "alert"
section: examples
exampleId: alert-component-basic
source:
  path: apps/site/src/components/AlertExample.tsx
  export: AlertExample
  language: tsx
runnable: true
---

The Alert component is a styled recipe wrapper around the `@solidiom/alert` primitive. It adds variant styling, composition with `Alert.Title` and `Alert.Description`, and semantic styling slots while delegating all state management and ARIA behavior to the underlying primitive.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="info">
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>A new software update is available.</Alert.Description>
</StyledAlert>
```

## Success variant

Use the success variant for positive outcomes and confirmations.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="success">
  <Alert.Title>Success</Alert.Title>
  <Alert.Description>Your changes have been saved.</Alert.Description>
</StyledAlert>
```

## Warning variant

Use the warning variant for cautionary messages that require attention.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="warning">
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Your session will expire in 5 minutes.</Alert.Description>
</StyledAlert>
```

## Error variant

Use the error variant for critical failures and action-required messages.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="error">
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Failed to connect to the server. Please try again.</Alert.Description>
</StyledAlert>
```
