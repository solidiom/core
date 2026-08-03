---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Select - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Select.
keywords: [select, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Select
productLayer: primitive
status: draft
package: "@solidiom/select"
primitive: select
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Opens the listbox if closed; moves highlight to the next option.
  - key: ArrowUp
    behavior: Moves highlight to the previous option.
  - key: Enter
    behavior: Selects the highlighted option and closes the listbox.
  - key: Escape
    behavior: Closes the listbox without changing the selection.
  - key: Space
    behavior: Opens the listbox or selects the highlighted option.
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="select"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
