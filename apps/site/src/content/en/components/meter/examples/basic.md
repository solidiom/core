---
contentSchemaVersion: 1
title: Basic meter
description: Meter component with scalar measurement display examples.
keywords: [meter, measurement, gauge, primitive]
locale: en
maturity: draft
product: Meter
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "meter"
section: examples
exampleId: meter-component-basic
source:
  path: apps/site/src/components/MeterExample.tsx
  export: MeterExample
  language: tsx
runnable: true
---

The Meter component is a styled recipe wrapper around the `@solidiom/meter` primitive. It provides a scalar measurement display using the native HTML `<meter>` element, with status states derived from value thresholds.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={0.7} min={0} max={1} />
```

## With thresholds

Define low, high, and optimum values to derive status states.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={75} min={0} max={100} low={25} high={75} optimum={100} />
```