---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Command Palette - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Command Palette.
keywords: [command-palette, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Command Palette
productLayer: primitive
status: draft
package: "@solidiom/command-palette"
primitive: command-palette
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="command-palette"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
