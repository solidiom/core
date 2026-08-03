---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Alert Dialog - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Alert Dialog.
keywords: [alert-dialog, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="alert-dialog"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
