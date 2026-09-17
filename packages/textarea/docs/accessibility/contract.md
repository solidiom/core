---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Textarea - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Textarea.
keywords: [textarea, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: accessibility
keyboard:
  - key: "Native textarea keyboard"
    behavior: "Supports native keyboard editing and text selection, and Enter inserts a newline for multiline entry."
focus:
  - "Root is a native textarea and receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="textarea"` and `data-part="root"` on the native control.'
  - "Preserves native textarea keyboard, selection, and form semantics."
aria:
  - "Preserves consumer ARIA attributes, including Field.Control relationship attributes."
  - "Component/native state controls derived ARIA; incoming ARIA alone does not promote to native disabled, required, or readonly behavior."
consumerDuties:
  - "Provide a visible label or an accessible name such as aria-label."
  - "Use Field.Control when the control needs reactive label, description, or error relationships."
nonApplicableCriteria: []
reviewStatus: draft
---
