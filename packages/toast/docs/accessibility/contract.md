---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Toast - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Toast.
keywords: [toast, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Region receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="toast"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
