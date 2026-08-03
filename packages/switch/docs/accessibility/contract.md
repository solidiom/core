---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Switch - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Switch.
keywords: [switch, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Switch
productLayer: primitive
status: draft
package: "@solidiom/switch"
primitive: switch
section: accessibility
keyboard:
  - key: Space
    behavior: Toggles the switch between on and off.
  - key: Enter
    behavior: Toggles the switch between on and off.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="switch"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
