---
contentSchemaVersion: 1
title: Button
description: Clickable trigger for actions with loading, disabled, and variant support.
keywords: [button, clickable, action, loading, disabled, submit, toggle]
locale: en
maturity: draft
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: overview
notApplicable:
  - section: composition
    reason: Button is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Button has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: Button has no prior API; this is the first shipped version.
  - section: testing
    reason: Standard button testing guidance is covered in the shared testing guide. No primitive-specific non-obvious behavior exists beyond keyboard activation documented above.
---

Button renders a clickable trigger for actions with accessible semantics. It supports a loading state, disabled state, and multiple component parts: `Root`, `IconButton`, `ToggleButton`, and `ButtonGroup`.

## Usage

Button exposes four parts. Use `Root` for standard action buttons, `IconButton` for icon-only buttons, `ToggleButton` for toggleable states, and `ButtonGroup` for grouped button layouts.

```tsx
import * as Button from "@solidiom/button"

;<Button.Root onClick={() => alert("clicked")}>Click me</Button.Root>
```

## Installation

Install the package with `pnpm add @solidiom/button`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

### Root

The standard button. Accepts `disabled`, `loading`, `type`, `onClick`, and `aria-label` props.

| Prop         | Type                              | Default    | Description                                                        |
| ------------ | --------------------------------- | ---------- | ------------------------------------------------------------------ |
| `children`   | `JSX.Element`                     | —          | Button content.                                                    |
| `disabled`   | `boolean`                         | —          | Whether the button is disabled.                                    |
| `loading`    | `boolean`                         | —          | Whether the button is in a loading state. Sets `aria-busy="true"`. |
| `type`       | `"button" \| "submit" \| "reset"` | `"button"` | Native button type.                                                |
| `onClick`    | `() => void`                      | —          | Click handler.                                                     |
| `aria-label` | `string`                          | —          | Accessible label for the button.                                   |

### IconButton

A button intended for icon-only content. Requires `aria-label` and wraps children in `aria-hidden="true"`.

### ToggleButton

A button that maintains a pressed state. Manages `aria-pressed` and calls `onPressedChange` on activation.

### ButtonGroup

A layout wrapper that groups buttons with `role="group"` and orientation support.

## Styling

Button carries `data-scope="button"` and `data-part` attributes for targeting:

- `Root`: `data-part="root"`, with `data-disabled` and `data-loading` when applicable
- `IconButton`: `data-part="root"` (wraps Root)
- `ToggleButton`: `data-part="toggle"`, with `data-state="on"` or `data-state="off"`
- `ButtonGroup`: `data-part="group"`, with `data-orientation`

Apply your visual recipe — variants (default, destructive, outline, secondary, ghost) and sizes (default, sm, lg, icon) — using these data attributes for targeting.

## Keyboard Interaction

Button supports standard button activation:

- **Enter** or **Space** activates the button when focused.
- The disabled and loading states prevent activation.

## SSR and hydration

Button renders as a native `<button>` element. It requires no client-side hydration for static rendering. Interactive state (`loading`, `disabled`) is managed through props.
