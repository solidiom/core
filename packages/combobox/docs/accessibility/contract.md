---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Combobox accessibility contract
description: Keyboard, focus, semantic, and consumer responsibilities for Combobox.
locale: en
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: accessibility
keyboard:
  - key: Enter
    behavior: Selects the currently highlighted item and closes the listbox.
  - key: Escape
    behavior: Closes the listbox without selecting. Focus remains on the input.
  - key: ArrowDown
    behavior: Opens the listbox if closed, or moves highlight to the next item.
  - key: ArrowUp
    behavior: Opens the listbox if closed, or moves highlight to the previous item.
  - key: Tab
    behavior: Closes the listbox and moves focus to the next focusable element.
focus:
  - The input retains DOM focus at all times while the listbox is open.
  - Active-descendant pattern visually highlights the current item without moving focus.
  - Focus returns to the input after the listbox closes.
semantics:
  - Input has role combobox.
  - Input exposes aria-autocomplete=list indicating suggestions are presented.
  - Content has role listbox.
  - Each item has role option.
aria:
  - Input exposes aria-expanded reflecting open state.
  - Input exposes aria-controls pointing to the listbox id.
  - Input exposes aria-activedescendant pointing to the highlighted item id.
  - Each item exposes aria-selected reflecting selection state.
consumerDuties:
  - Provide an accessible label for the input via a visible label element or aria-label.
  - Communicate an empty state when no items match the current filter.
  - Ensure item text values are unique and descriptive.
nonApplicableCriteria: []
reviewStatus: draft
---

## Automated evidence

The evidence summary below is generated from the repository's executable axe scan for `@solidiom/combobox`. It records automated checks only; it is not a claim of complete conformance.

## Manual verification

Review keyboard navigation, active-descendant highlighting, input focus retention, zoom/reflow, touch targets, reduced motion, contrast, and screen-reader announcements in the consuming product. A consumer's layout, labels, and filtering logic can change the accessibility result.
