---
contentSchemaVersion: 1
title: Input OTP
description: A one-time password input with individual character slots.
keywords: [character, individual, input, one, otp, password, runtime]
locale: en
maturity: draft
product: Input OTP
productLayer: primitive
status: draft
package: "@solidiom/input-otp"
primitive: input-otp
section: overview
notApplicable:
  - section: relationships
    reason: Input OTP has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

A one-time password input with individual character slots.

## Usage

Compose `Root`, `Group`, `Slot`.

```tsx
import * as InputOtp from "@solidiom/input-otp"

;<InputOtp.Root>Input OTP content</InputOtp.Root>
```

## Installation

Install the package with `pnpm add @solidiom/input-otp`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Input OTP exposes 3 parts:

- **Root** — `data-part="root"`.
- **Group** — `data-part="group"`.
- **Slot** — `data-part="slot"`.

## Styling

Input OTP carries `data-scope="input-otp"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Input OTP is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Input OTP renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
