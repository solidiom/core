---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Avatar - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Avatar.
keywords: [avatar, accessibility, image, fallback, screen-reader, alt]
locale: en
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: accessibility
keyboard: []
focus: []
semantics:
  - "Renders `Root` as a `<span>` with `data-scope=\"avatar\"` and `data-part=\"root\"`."
  - "Renders `Image` as an `<img>` with `data-scope=\"avatar\"` and `data-part=\"image\"`. The `alt` attribute is passed through for screen readers."
  - "Renders `Fallback` as a `<span>` with `data-scope=\"avatar\"` and `data-part=\"fallback\"`. Hidden when the image loads successfully."
aria:
  - "The `alt` prop on `Image` provides the accessible name for the avatar image."
  - "When the image is hidden during loading, the `Fallback` content is visible to screen readers."
  - "No ARIA roles are added beyond the native semantics of `<img>` and `<span>`."
consumerDuties:
  - "Always provide a meaningful `alt` prop on `Image` that describes the person or entity the avatar represents."
  - "Provide fallback content (initials, name, or icon) in `Fallback` for cases where the image cannot load."
  - "Ensure the fallback text is sufficient to identify the user when the image is unavailable."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Avatar is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Avatar is a non-interactive display element and does not receive focus.
reviewStatus: draft
---