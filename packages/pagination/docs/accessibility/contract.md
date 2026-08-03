---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Pagination - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Pagination.
keywords: [pagination, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Pagination
productLayer: primitive
status: draft
package: "@solidiom/pagination"
primitive: pagination
section: accessibility
keyboard:
  - key: Enter/Space
    behavior: Activates the focused page button.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="pagination"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
