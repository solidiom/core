---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Menu - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Menu.
keywords: [menu, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Menu
productLayer: primitive
status: draft
package: "@solidiom/menu"
primitive: menu
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Moves focus to the next menu item.
  - key: ArrowUp
    behavior: Moves focus to the previous menu item.
  - key: Enter/Space
    behavior: Activates the focused menu item.
  - key: Escape
    behavior: Closes the menu and returns focus to the trigger.
  - key: ArrowRight
    behavior: Opens a sub-menu when focus is on a sub-trigger.
  - key: ArrowLeft
    behavior: Closes the sub-menu and returns focus to the parent.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="menu"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
