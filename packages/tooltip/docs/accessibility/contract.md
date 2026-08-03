---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tooltip - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Tooltip.
keywords: [tooltip, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="tooltip"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no keyboard interaction beyond native element defaults."
reviewStatus: draft
---
