---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Navigation Menu - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Navigation Menu.
keywords: [navigation-menu, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Navigation Menu
productLayer: primitive
status: draft
package: "@solidiom/navigation-menu"
primitive: navigation-menu
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Opens the dropdown content when focus is on a trigger.
  - key: Escape
    behavior: Closes the dropdown content.
  - key: Tab
    behavior: Moves focus to the next focusable element in the navigation.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="navigation-menu"` and `data-part` attributes on all parts.'
aria:
  - "Uses appropriate ARIA roles and properties for its interaction pattern."
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
