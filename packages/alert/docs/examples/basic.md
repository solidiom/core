---
contentSchemaVersion: 1
title: Basic alert
description: Alert variants and assertiveness examples.
keywords: [alert, notification, info, success, warning, error, assertive, polite]
locale: en
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: examples
exampleId: alert-basic
source:
  path: packages/alert/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Alert from "@solidiom/alert"

;<Alert.Root type="info">
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>A new feature is available in your dashboard.</Alert.Description>
</Alert.Root>
```

## Variants

Alert supports four visual variants controlled by the `type` prop.

```tsx
;<Alert.Root type="success">
  <Alert.Title>Success</Alert.Title>
  <Alert.Description>Your changes have been saved.</Alert.Description>
</Alert.Root>

;<Alert.Root type="warning">
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>You are approaching your storage limit.</Alert.Description>
</Alert.Root>

;<Alert.Root type="error">
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Failed to connect to the server.</Alert.Description>
</Alert.Root>
```

## Assertiveness

Control how the alert is announced to screen readers with the `assertiveness` prop. Use `polite` for non-urgent updates that should not interrupt the user.

```tsx
;<Alert.Root type="info" assertiveness="polite">
  <Alert.Title>Update</Alert.Title>
  <Alert.Description>New messages have arrived.</Alert.Description>
</Alert.Root>
```
