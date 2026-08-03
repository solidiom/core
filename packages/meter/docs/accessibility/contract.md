---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Meter - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Meter.
keywords: [meter, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Meter
productLayer: primitive
status: draft
package: "@solidiom/meter"
primitive: meter
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="meter"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria:
  - criterion: aria
    rationale: "This primitive renders semantic HTML without additional ARIA attributes."
  - criterion: keyboard
    rationale: "This primitive has no interactive keyboard behavior beyond native element defaults."
reviewStatus: draft
---
