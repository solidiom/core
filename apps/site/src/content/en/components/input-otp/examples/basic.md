---
contentSchemaVersion: 1
title: Basic input OTP
description: Multi-digit one-time password input with auto-advance between slots.
keywords: [input-otp, otp, verification, password]
locale: en
maturity: draft
product: Input OTP
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "input-otp"
section: examples
exampleId: input-otp-component-basic
source:
  path: apps/site/src/components/InputOtpExample.tsx
  export: InputOtpExample
  language: tsx
runnable: true
---

The Input OTP component provides a multi-digit one-time password input with auto-advance between slots.

```tsx
import { StyledInputOTP, InputOTP } from "@solidiom/recipes-css"

;<InputOTP.Root maxLength={6}>
  <InputOTP.Group>
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <InputOTP.Slot index={index} />
    ))}
  </InputOTP.Group>
</InputOTP.Root>
```
