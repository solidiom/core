---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tree - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Tree.
keywords: [tree, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the primary interactive element.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="tree"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
