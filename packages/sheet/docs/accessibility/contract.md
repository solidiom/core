---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Sheet - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Sheet.
keywords: [sheet, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Sheet
productLayer: primitive
status: draft
package: "@solidiom/sheet"
primitive: sheet
section: accessibility
keyboard:
  - key: Escape
    behavior: Closes the sheet and returns focus to the trigger.
  - key: Tab
    behavior: Moves focus within the sheet content (focus trapped).
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="sheet"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
