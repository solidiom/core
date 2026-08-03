---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Scroll Area - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Scroll Area.
keywords: [scroll-area, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Scroll Area
productLayer: primitive
status: draft
package: "@solidiom/scroll-area"
primitive: scroll-area
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="scroll-area"` and `data-part` attributes on all parts.'
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
