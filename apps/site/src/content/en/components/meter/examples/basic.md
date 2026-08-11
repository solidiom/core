---
contentSchemaVersion: 1
title: Basic meter
description: Gauge meter component with safe, caution, and danger states.
keywords: [meter, gauge, progress, status]
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

The Meter component displays a scalar measurement within a known range, such as disk usage or a rating.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter
  value={0.35}
  min={0}
  max={1}
  low={0.5}
  high={0.8}
  optimum={0}
  aria-label="Disk usage"
/>
```
