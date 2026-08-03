---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Hover Card - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Hover Card.
keywords: [hover-card, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="hover-card"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
