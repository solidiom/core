---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Date Picker - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Date Picker.
keywords: [date-picker, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="date-picker"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
