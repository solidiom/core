---
contentSchemaVersion: 1
title: Medidor básico
description: Componente de medidor con estados de seguro, precaución y peligro.
keywords: [meter, gauge, progress, status]
locale: es
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
translationSourceHash: "8714261d8f47edf16904160b07db000e563ff37f5f16f66fd07a914a607197ae"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Meter muestra una medición escalar dentro de un rango conocido, como el uso de disco o una calificación.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter
  value={0.35}
  min={0}
  max={1}
  low={0.5}
  high={0.8}
  optimum={0}
  aria-label="Uso de disco"
/>
```
