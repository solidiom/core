---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Drawer - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Drawer.
keywords: [drawer, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="drawer"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
