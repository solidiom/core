---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Kbd - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Kbd.
keywords: [kbd, accessibility, keyboard, screen-reader]
locale: en
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: accessibility
keyboard: []
focus: []
semantics:
  - Renders as a native `<kbd>` element indicating keyboard input.
  - Has no interactive behavior and receives no keyboard focus.
aria:
  - No ARIA attributes are required; the native `<kbd>` element provides sufficient semantics.
consumerDuties:
  - Use Kbd to represent actual keyboard keys or shortcuts.
  - Ensure surrounding text provides context for what the key combination does.
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Kbd is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Kbd is a non-interactive display element and does not receive focus.
reviewStatus: draft
---
