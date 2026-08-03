---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Input - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Input.
keywords: [input, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="input"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
