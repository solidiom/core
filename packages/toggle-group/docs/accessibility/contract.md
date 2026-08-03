---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toggle Group - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Toggle Group.
keywords: [toggle-group, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Toggle Group
productLayer: primitive
status: draft
package: "@solidiom/toggle-group"
primitive: toggle-group
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="toggle-group"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
