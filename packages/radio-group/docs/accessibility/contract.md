---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Radio Group - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Radio Group.
keywords: [radio-group, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Radio Group
productLayer: primitive
status: draft
package: "@solidiom/radio-group"
primitive: radio-group
section: accessibility
keyboard:
  - key: ArrowDown/ArrowRight
    behavior: Moves selection to the next radio item.
  - key: ArrowUp/ArrowLeft
    behavior: Moves selection to the previous radio item.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="radio-group"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
