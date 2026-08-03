---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Spinner - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Spinner.
keywords: [spinner, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Spinner
productLayer: primitive
status: draft
package: "@solidiom/spinner"
primitive: spinner
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="spinner"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
