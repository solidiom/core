---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Context Menu - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Context Menu.
keywords: [context-menu, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Context Menu
productLayer: primitive
status: draft
package: "@solidiom/context-menu"
primitive: context-menu
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="context-menu"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
