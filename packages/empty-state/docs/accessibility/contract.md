---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Empty State - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Empty State.
keywords: [empty-state, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="empty-state"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
