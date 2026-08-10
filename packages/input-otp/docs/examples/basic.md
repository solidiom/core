---
contentSchemaVersion: 1
title: Input OTP - Basic usage
description: Basic input otp example demonstrating core behavior.
keywords: [input-otp, basic, example]
locale: en
maturity: draft
product: Input OTP
productLayer: primitive
status: draft
package: "@solidiom/input-otp"
primitive: input-otp
section: examples
exampleId: input-otp-basic
source:
  path: packages/input-otp/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as InputOtp from "@solidiom/input-otp"

;<InputOtp.Root
  maxLength={6}
  pattern="^[0-9]*$"
  onComplete={(value) => console.log("Code entered:", value)}
>
  <InputOtp.Group>
    <InputOtp.Slot index={0} />
    <InputOtp.Slot index={1} />
    <InputOtp.Slot index={2} />
  </InputOtp.Group>

  <InputOtp.Group>
    <InputOtp.Slot index={3} />
    <InputOtp.Slot index={4} />
    <InputOtp.Slot index={5} />
  </InputOtp.Group>
</InputOtp.Root>
```

Each Slot displays one character from the OTP value. Use `Group` to visually separate segments. The `pattern` prop restricts allowed characters. The `onComplete` callback fires when all slots are filled.
