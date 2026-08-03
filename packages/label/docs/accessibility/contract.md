---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Label - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Label.
keywords: [label, accessibility, wcag, screen-reader, form]
locale: en
maturity: draft
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
section: accessibility
keyboard: []
focus: []
semantics:
  - Renders as a native `<label>` element.
  - Provides the accessible name for the associated form control via the htmlFor/id pair.
aria:
  - No additional ARIA attributes are required; the native `<label>` element provides sufficient semantics.
consumerDuties:
  - Set htmlFor to match the id of the associated form control.
  - Provide clear, concise label text that describes the purpose of the form control.
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Label is a non-interactive display element with no keyboard interactions beyond native browser label-click-to-focus behavior.
  - criterion: focus
    rationale: Label itself does not receive keyboard focus; it is a static association element.
  - criterion: portalling
    rationale: Label has no DOM relocation requirements.
reviewStatus: draft
---