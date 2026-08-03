---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Input OTP - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Input OTP.
keywords: [input-otp, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Input OTP
productLayer: primitive
status: draft
package: "@solidiom/input-otp"
primitive: input-otp
section: accessibility
keyboard: []
focus:
  - "Root receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="input-otp"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
