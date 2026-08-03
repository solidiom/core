---
contentSchemaVersion: 1
title: Label
description: Accessible label element linked to form controls via htmlFor.
keywords: [label, form, accessible, htmlfor, input]
locale: en
maturity: draft
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
section: overview
---

Label renders a native `<label>` element with semantic data attributes. Use it to associate text with form controls, providing the accessibility connection required by assistive technologies.

## Usage

Label has a single `Root` part. Use `htmlFor` to link it to a form control by its `id`.

```tsx
import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"

;<div>
  <Label.Root htmlFor="email">Email address</Label.Root>
  <Input.Root id="email" type="email" />
</div>
```

Label is designed to compose with the `Field` primitive. When used inside `Field`, the `htmlFor` wiring is often handled automatically.

### State hints

Use `disabled`, `required`, and `invalid` props to reflect the associated control's state. These emit `data-disabled`, `data-required`, and `data-invalid` attributes for styling purposes. They do not affect the form control itself; the control owns its own state.

## Installation

Install the package with `pnpm add @solidiom/label`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Styling

Label carries `data-scope="label"` and `data-part="root"` attributes. State flags (`data-disabled`, `data-required`, `data-invalid`) are available for conditional styling. The element inherits browser default `<label>` styling; override with your recipe for a consistent appearance.

## SSR and hydration

Label is a static display element with no interactive state. It renders as static HTML and requires no client-side hydration.
