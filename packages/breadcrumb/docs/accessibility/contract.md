---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Breadcrumb - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Breadcrumb.
keywords: [breadcrumb, accessibility, navigation, screen-reader, aria-label, aria-current]
locale: en
maturity: draft
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renders the root as a `<nav>` element with `aria-label="Breadcrumb"`.'
  - "Renders items within an `<ol>` list structure for proper semantic ordering."
  - "Each breadcrumb entry is an `<li>` containing a navigation link."
  - 'The current page link carries `aria-current="page"` to indicate the active location.'
  - 'Separator and Ellipsis render with `role="presentation"` and `aria-hidden="true"` (Separator) to hide decorative content from the accessibility tree.'
  - 'Carries `data-scope="breadcrumb"` and `data-part` attributes on all parts.'
aria:
  - '`aria-label="Breadcrumb"` on the `<nav>` identifies the navigation region for screen readers.'
  - '`aria-current="page"` on the current page link indicates the user''s present location in the hierarchy.'
  - '`role="presentation"` on Separator and Ellipsis removes decorative elements from the accessibility tree.'
  - '`aria-hidden="true"` on Separator ensures the visual divider is not announced.'
consumerDuties:
  - Use Breadcrumb to represent the user's current location within a navigational hierarchy.
  - "Set `current` on the `Link` that corresponds to the current page."
  - "Use `Ellipsis` to indicate omitted intermediate levels in deeply nested hierarchies."
  - "Ensure all `Link` elements have meaningful text content for screen reader users."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Breadcrumb relies on standard anchor element keyboard interactions (Tab/Enter/Space); no custom keyboard handling is required.
  - criterion: focus
    rationale: Breadcrumb relies on standard anchor element focus management; no custom focus handling is required.
reviewStatus: draft
---
