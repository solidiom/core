---
contentSchemaVersion: 1
title: Label
description: Headless label primitive for associating text with a form control.
keywords: [label, form, input, primitive, accessibility]
locale: en
maturity: beta
product: Label
productLayer: component
status: published
package: "@solidiom/label"
---

The `@solidiom/label` package exports the `Label.Root` primitive. No `StyledLabel` wrapper is exported by the recipe packages.

## Usage

```tsx
import * as Label from "@solidiom/label"

;<Label.Root htmlFor="email">Email address</Label.Root>
```

`Label.Root` accepts `htmlFor`, `id`, `disabled`, `required`, `invalid`, `class`, `style`, and `children`.

## Installation

```sh
pnpm add @solidiom/label
```

## Styling

The primitive emits semantic `data-scope="label"` and `data-part="root"` attributes and accepts `class` and `style` props. Add application styles directly; a recipe wrapper is not currently exported for this primitive.

## Accessibility

`Label.Root` renders a native `<label>` and links it to a control through `htmlFor`. See the [Label primitive accessibility contract](/primitives/label/accessibility/).
