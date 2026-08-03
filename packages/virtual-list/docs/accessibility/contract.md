---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Virtual List - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Virtual List.
keywords: [virtual-list, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="virtual-list"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
