---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Visually Hidden - Accessibility Contract
description: Semantic, screen reader, and consumer responsibilities for Visually Hidden.
keywords: [visually-hidden, accessibility, screen-reader, clip, assistive-technology]
locale: en
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: accessibility
keyboard: []
focus: []
semantics:
  - "Renders as a `<span>` with inline clipping styles to hide content visually."
  - "Content remains in the DOM and the accessibility tree, accessible to screen readers."
  - 'Carries `data-scope="visually-hidden"` and `data-part="root"` attributes.'
aria:
  - "Does not add any ARIA roles or attributes; relies on the natural semantics of wrapped content."
  - "The clip/overflow technique ensures content is invisible to sighted users while remaining announced by screen readers."
consumerDuties:
  - Use Visually Hidden only for content that is meaningful to screen reader users.
  - "Do not use Visually Hidden to hide content that should be visible to all users."
  - "Ensure the hidden content provides value to assistive technology users, such as descriptive labels or structural headings."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Visually Hidden is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Visually Hidden is a non-interactive display element and does not receive focus.
reviewStatus: draft
---
