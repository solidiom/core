---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Card - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Card.
keywords: [card, accessibility, container, screen-reader, semantic-html]
locale: en
maturity: draft
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renders `Root`, `Header`, `Content`, and `Footer` as `<div>` elements with `data-scope="card"` and corresponding `data-part` attributes.'
  - "Renders `Title` as an `<h3>` heading element, providing document outline structure."
  - "Renders `Description` as a `<p>` paragraph element."
  - 'All parts carry `data-scope="card"` and `data-part="*"` attributes for identification.'
aria: []
consumerDuties:
  - "Use Card to group logically related content and actions."
  - "Ensure `Title` text is descriptive and meaningful for screen reader users."
  - "If the card wraps a link or button, apply appropriate ARIA roles or semantic HTML to the interactive element inside `Content`."
  - "Do not nest interactive elements directly on `Root`; place them within `Content` or `Footer`."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Card is a non-interactive container element with no keyboard interactions.
  - criterion: focus
    rationale: Card is a non-interactive container element and does not receive focus.
  - criterion: aria
    rationale: Card relies on semantic HTML elements (h3, p) for accessibility and does not require additional ARIA attributes.
reviewStatus: draft
---
