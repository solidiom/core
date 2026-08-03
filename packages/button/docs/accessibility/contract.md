---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Button - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Button.
keywords: [button, accessibility, clickable, keyboard, focus, aria-busy, aria-pressed]
locale: en
maturity: draft
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: accessibility
keyboard:
  - key: Enter
    behavior: Activates the button when focused.
  - key: Space
    behavior: Activates the button when focused.
focus:
  - "Button.Root renders as a native `<button>` element and receives focus by default."
  - "Disabled and loading buttons are removed from the tab order via the native `disabled` attribute."
semantics:
  - 'Renders as a native `<button>` element with `data-scope="button"` and `data-part="root"`.'
  - 'When `loading` is true, sets `aria-busy="true"` and disables the button.'
  - 'ToggleButton renders as a `<button>` with `aria-pressed` reflecting the pressed state and `data-part="toggle"`.'
  - 'IconButton wraps children in `aria-hidden="true"` and requires `aria-label` for the accessible name.'
  - 'ButtonGroup renders as a `<div>` with `role="group"` and `data-part="group"`.'
  - "Carries `data-disabled` and `data-loading` attributes when the respective states are active."
aria:
  - '`aria-busy="true"` indicates the button is in a loading state.'
  - "`aria-pressed` on ToggleButton indicates the current toggle state."
  - "`aria-label` on IconButton provides the accessible name for icon-only buttons."
  - '`role="group"` on ButtonGroup associates related buttons.'
consumerDuties:
  - Ensure button text or `aria-label` clearly communicates the action.
  - "Use `IconButton` with a meaningful `aria-label` when the button contains no visible text."
  - "Use `ToggleButton` for actions that toggle between two states, and manage the `pressed` state externally."
  - "Use `ButtonGroup` to group logically related buttons with a shared visual context."
nonApplicableCriteria: []
reviewStatus: draft
---
