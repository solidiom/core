---
contentSchemaVersion: 1
title: Input OTP básico
description: Entrada de contraseña de un solo uso de varios dígitos con avance automático entre espacios.
keywords: [input-otp, otp, verification, password]
locale: es
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
translationSourceHash: "b8c06cf347438d335dc79d96253c8cb53912bfc9968dffcc3e2ca5da5852cec8"
translationStatus: draft
---

El componente Input OTP proporciona una entrada de contraseña de un solo uso de varios dígitos con avance automático entre espacios.

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
