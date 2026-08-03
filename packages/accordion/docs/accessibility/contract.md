---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Accordion - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Accordion.
keywords: [accordion, accessibility, wcag, aria, keyboard, focus]
locale: en
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Moves focus to the trigger of the next item.
  - key: ArrowUp
    behavior: Moves focus to the trigger of the previous item.
  - key: Home
    behavior: Moves focus to the trigger of the first item.
  - key: End
    behavior: Moves focus to the trigger of the last item.
  - key: Space or Enter
    behavior: Toggles the expanded state of the focused item.
  - key: Tab
    behavior: Moves focus out of the accordion trigger group.
focus:
  - Focus is confined to triggers within the accordion trigger group.
  - After opening or closing an item, focus remains on the trigger.
semantics:
  - Root renders as a group of accordion items.
  - Trigger has role button and controls the expanded state of its item.
  - Content has role region and is hidden from assistive technology when collapsed.
aria:
  - Trigger has aria-expanded reflecting the open/closed state of its item.
  - Trigger has aria-controls pointing to the id of its content element.
  - Content has aria-labelledby pointing to the id of its trigger element.
consumerDuties:
  - Provide a unique, descriptive label for each Trigger.
  - Ensure Content is meaningful when announced by assistive technology.
  - Use collapsible for accordions where no item needs to remain permanently open.
nonApplicableCriteria: []
reviewStatus: draft
---

## Data attributes

Accordion emits data attributes for styling and state-based decisions:

| Attribute       | Values                                       | Description                                                    |
| --------------- | -------------------------------------------- | -------------------------------------------------------------- |
| `data-scope`    | `"accordion"`                                | Identifies the element as belonging to the Accordion primitive |
| `data-part`     | `"root"`, `"item"`, `"trigger"`, `"content"` | Identifies the specific part                                   |
| `data-state`    | `"open"`, `"closed"`                         | Present on Item; reflects expanded state                       |
| `data-expanded` | `"true"`, `"false"`                          | Present on Trigger; mirrors expanded state                     |
| `data-disabled` | `""` or absent                               | Present when the item is disabled                              |
