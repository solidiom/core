---
contentSchemaVersion: 1
title: Meter básico
description: Componente meter con ejemplos de visualización de medida escalar.
keywords: [meter, measurement, gauge, primitive]
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

El componente Meter es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/meter`. Proporciona una visualización de medida escalar utilizando el elemento nativo HTML `<meter>`, con estados derivados de umbrales de valor.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={0.7} min={0} max={1} />
```

## Con umbrales

Define valores low, high y optimum para derivar estados de estado.

```tsx
import { StyledMeter } from "@solidiom/recipes-css"

;<StyledMeter value={75} min={0} max={100} low={25} high={75} optimum={100} />
```