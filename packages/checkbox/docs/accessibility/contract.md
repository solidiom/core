---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Checkbox - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Checkbox.
keywords: [checkbox, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Checkbox
productLayer: primitive
status: draft
package: "@solidiom/checkbox"
primitive: checkbox
section: accessibility
keyboard:
  - key: Space
    behavior: Toggles the checkbox between checked and unchecked.
focus:
  - "Group receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="checkbox"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
