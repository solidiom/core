---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Field - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Field.
keywords: [field, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Field
productLayer: primitive
status: draft
package: "@solidiom/field"
primitive: field
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="field"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
---
