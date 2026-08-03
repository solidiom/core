---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Skeleton - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Skeleton.
keywords: [skeleton, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Skeleton
productLayer: primitive
status: draft
package: "@solidiom/skeleton"
primitive: skeleton
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="skeleton"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
