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
translationSourceHash: "e386119a0812a505199c081ad0c00a90e9ad1e69bf17abf139a78d83ec9fa526"
translationStatus: draft
---

El componente Meter muestra una medición escalar dentro de un rango conocido, como el uso de disco o una calificación.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={0.35} min={0} max={1} low={0.5} high={0.8} optimum={0} aria-label="Uso de disco" />
```
