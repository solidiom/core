---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Separator - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Separator.
keywords: [separator, accessibility, divider, screen-reader, aria-orientation]
locale: en
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renders as a `<div>` with `role="separator"` and `aria-orientation` by default.'
  - 'When `decorative` is true, renders with `role="none"` and no `aria-orientation`, removing it from the accessibility tree.'
  - 'Carries `data-scope="separator"`, `data-part="root"`, and `data-orientation` attributes.'
aria:
  - '`role="separator"` indicates a visual divider between content regions.'
  - '`aria-orientation="horizontal"` or `aria-orientation="vertical"` specifies the divider orientation. Defaults to horizontal.'
  - 'When `decorative` is true, `role="none"` is used instead to hide the element from assistive technologies.'
consumerDuties:
  - Use Separator to divide logically distinct content regions.
  - "Set `decorative` when the divider is purely visual and does not separate meaningful content sections."
  - 'Use `orientation="vertical"` only when the separator visually divides content side by side.'
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Separator is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Separator is a non-interactive display element and does not receive focus.
reviewStatus: draft
---
