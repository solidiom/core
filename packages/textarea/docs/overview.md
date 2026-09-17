---
contentSchemaVersion: 1
title: Textarea
description: Native textarea primitive with validation states and optional auto-resizing.
keywords: [and, auto, input, native, optional, primitive, resizing]
locale: en
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: overview
notApplicable:
  - section: composition
    reason: Textarea is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Textarea has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Native textarea primitive with validation states and optional auto-resizing.

## Usage

Import and render `Root`.

```tsx
import * as Textarea from "@solidiom/textarea"

;<Textarea.Root defaultValue="Textarea content" aria-label="Message" />
```

## Installation

Install the package with `pnpm add @solidiom/textarea`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Textarea exposes 1 part:

- **Root** — `data-part="root"`.

## Styling

Textarea carries `data-scope="textarea"` and `data-part="root"` for CSS/recipe targeting. State attributes such as `data-disabled`, `data-invalid`, `data-readonly`, and `data-required` are exposed when the corresponding native/component state or incoming ARIA state is present.

## Keyboard & behavior

Root is a native, focusable `<textarea>` and retains the browser's normal keyboard, selection, form, and focus behavior. Use `value` for controlled state, `defaultValue` for an uncontrolled mount-time value, and `onValueChange` for input notifications. `autoResize` measures on the client after settlement and can be limited with `maxRows`.

## SSR and hydration

Textarea renders its native value and semantic attributes during server rendering. `defaultValue` is an uncontrolled mount-time snapshot and is not reapplied when its prop changes. Client-only auto-resize runs after hydration and may change layout. Incoming `aria-disabled`, `aria-required`, and `aria-readonly` describe state but do not by themselves set the native disabled, required, or readonly properties; pass the component/native state props when native behavior is required.
