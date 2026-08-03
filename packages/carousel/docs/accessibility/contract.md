---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Carousel - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Carousel.
keywords: [carousel, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Carousel
productLayer: primitive
status: draft
package: "@solidiom/carousel"
primitive: carousel
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="carousel"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
