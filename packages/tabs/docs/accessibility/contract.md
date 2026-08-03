---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Tabs - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Tabs.
keywords: [tabs, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Tabs
productLayer: primitive
status: draft
package: "@solidiom/tabs"
primitive: tabs
section: accessibility
keyboard:
  - key: ArrowRight
    behavior: Moves focus to the next tab trigger.
  - key: ArrowLeft
    behavior: Moves focus to the previous tab trigger.
  - key: Home
    behavior: Moves focus to the first tab trigger.
  - key: End
    behavior: Moves focus to the last tab trigger.
  - key: Enter/Space
    behavior: Activates the focused tab (in manual activation mode).
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="tabs"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
