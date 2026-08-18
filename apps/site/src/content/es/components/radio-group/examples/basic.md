---
contentSchemaVersion: 1
title: Basic radio group
description: Radio group component with single-selection from grouped options.
keywords: [radio-group, radio, selection, form, primitive]
locale: es
maturity: draft
product: Radio Group
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "radio-group"
section: examples
exampleId: radio-group-component-basic
source:
  path: apps/site/src/components/RadioGroupExample.tsx
  export: RadioGroupExample
  language: tsx
  runnable: true
translationSourceHash: "44cecb057569808c0d4d5151eca281d9db72a54be007d7e46c36e5b9304bfaf9"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

The Radio Group component is a styled recipe wrapper around the `@solidiom/radio-group` primitive. It provides accessible single-selection from a group of options with roving tabindex keyboard navigation.

```tsx
import { StyledRadioGroup, RadioGroup } from "@solidiom/recipes-css"

;<StyledRadioGroup defaultValue="option1">
  <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
  <RadioGroup.Item value="option3">Option 3</RadioGroup.Item>
</StyledRadioGroup>
```
