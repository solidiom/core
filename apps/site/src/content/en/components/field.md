---
contentSchemaVersion: 1
title: Field
description: Form field wrapper with label, control, description, and error message styling.
keywords: [field, form, label, validation, error]
locale: en
maturity: beta
product: Field
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "field"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Form field wrapper with label, control, description, and error message styling.

## Usage

The Field component is a styled recipe wrapper around the `@solidiom/field` primitive. It provides a composition layer for form fields with semantic styling for label, description, and error states.

```tsx
import { StyledField } from "@solidiom/recipes-css"
import * as Field from "@solidiom/field"
import { StyledInput } from "@solidiom/recipes-css"

;<StyledField>
  <Field.Label>Email</Field.Label>
  <Field.Control>
    {(controlProps) => <StyledInput {...controlProps()} placeholder="you@example.com" />}
  </Field.Control>
  <Field.Description>We'll never share your email.</Field.Description>
  <Field.Error>Email is required.</Field.Error>
</StyledField>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/field` primitive as a peer dependency.

## Anatomy

The Field component wraps the `@solidiom/field` primitive. It exposes five parts through a recipe-applied composition layer:

- **Root** — container that provides ARIA context to child parts and manages form control state.
- **Label** — accessible label linked to the control via `for`.
- **Control** — render-prop wrapper that passes ARIA props to the consumer's form control element.
- **Description** — helper text linked via `aria-describedby` when the field is valid.
- **Error** — error message shown only when `invalid` is true, with `role="alert"`.

## Variants & states

Field does not use variants. Styling is driven by form state flags:

- **Required** — indicates the field must have a value.
- **Disabled** — muted appearance with reduced opacity across all parts.
- **Invalid** — triggers display of the error message and hides the description.
- **Readonly** — indicates the field cannot be edited.

## Styling

Field is available in css, tailwind, unocss profiles. Each profile applies the same semantic flags and form states, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-field` namespace for CSS profiling and targeting.

## SSR and hydration

Field renders as semantic HTML `<div>` and `<label>` elements during server rendering. The ARIA relationship wiring activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Field delegates accessibility to `@solidiom/field`. The primitive automatically wires ARIA relationships between label, control, description, and error elements using `createFormControl` from `@solidiom/runtime`. Error messages render with `role="alert"` and `aria-live="assertive"` for screen reader announcements. See the [Field primitive accessibility contract](/primitives/field/accessibility/) for the full keyboard, focus, and ARIA contract.
