---
contentSchemaVersion: 1
title: Input OTP
description: Styled input OTP component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input-otp primitive.
keywords: [input-otp, otp, verification, code, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Input OTP
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "input-otp"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled input OTP component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input-otp primitive.

## Usage

The Input OTP component is a styled recipe wrapper around the `@solidiom/input-otp` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as InputOtp from "@solidiom/recipes-css"

;<InputOtp.Root maxLength={6}>
  <InputOtp.Group>
    <InputOtp.Slot index={0} />
    <InputOtp.Slot index={1} />
    <InputOtp.Slot index={2} />
  </InputOtp.Group>
  <InputOtp.Separator />
  <InputOtp.Group>
    <InputOtp.Slot index={3} />
    <InputOtp.Slot index={4} />
    <InputOtp.Slot index={5} />
  </InputOtp.Group>
</InputOtp.Root>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/input-otp` primitive as a peer dependency.

## Anatomy

The Input OTP component wraps the `@solidiom/input-otp` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages OTP input state.
- **Group** — groups slots together visually.
- **Slot** — individual character input slot.
- **Separator** — visual separator between groups.

## Variants & states

Input OTP inherits its variant and state support from `@solidiom/input-otp`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Input OTP is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-input-otp` namespace for CSS profiling and targeting.

## SSR and hydration

Input OTP renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Input OTP delegates accessibility to `@solidiom/input-otp`. See the [Input OTP primitive accessibility contract](/primitives/input-otp/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
