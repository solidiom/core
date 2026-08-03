---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Popover - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Popover.
keywords: [popover, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Popover
productLayer: primitive
status: draft
package: "@solidiom/popover"
primitive: popover
section: accessibility
keyboard:
  - key: Escape
    behavior: Closes the popover and returns focus to the trigger.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="popover"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
