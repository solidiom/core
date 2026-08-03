---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Collapsible - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Collapsible.
keywords: [collapsible, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Collapsible
productLayer: primitive
status: draft
package: "@solidiom/collapsible"
primitive: collapsible
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="collapsible"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
