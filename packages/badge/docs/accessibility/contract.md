---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Badge - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Badge.
keywords: [badge, accessibility, label, status, screen-reader]
locale: en
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: accessibility
keyboard: []
focus: []
semantics:
  - "Renders as a `<span>` element."
  - 'Carries `data-scope="badge"` and `data-part="root"` attributes.'
  - "Contains presentational text content provided via `children`."
aria:
  - "The badge does not add ARIA roles or properties by default; it relies on its visual presentation as an inline label."
  - 'Consumers may add semantic roles such as `role="status"` or `aria-label` depending on the context and meaning of the badge content.'
consumerDuties:
  - "Provide meaningful text content via `children` that conveys the badge's purpose."
  - "Add `aria-label` or ARIA role when the badge conveys live or dynamic status information."
  - "Ensure sufficient color contrast between badge text and background for readability."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Badge is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Badge is a non-interactive display element and does not receive focus.
reviewStatus: draft
---
