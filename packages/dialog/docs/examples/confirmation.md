---
contentSchemaVersion: 1
title: Confirmation dialog
description: A destructive-action confirmation that demonstrates the complete Dialog composition.
locale: en
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: examples
exampleId: dialog-confirmation
source:
  path: apps/site/src/components/DialogExample.tsx
  export: DialogExample
  language: tsx
runnable: true
---

The live example uses a confirmation action because it needs a clear title, an explanation of the consequence, and an explicit dismissal path. Press <kbd>Escape</kbd>, select **Cancel**, or select **Delete workspace** to close it. No data is changed.

The trigger restores focus after dismissal. The visual treatment inherits the site’s light and dark semantic tokens rather than embedding theme values in the example.
