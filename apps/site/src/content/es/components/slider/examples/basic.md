---
contentSchemaVersion: 1
title: "Slider – Ejemplo Básico"
description: "Un ejemplo básico del componente Slider para seleccionar un valor de un rango."
keywords: ["slider", "rango", "entrada", "thumb", "pista"]
locale: es
maturity: draft
product: Slider
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "slider"
section: examples
exampleId: slider-component-basic
source: "@site/components/SliderExample.tsx"
runnable: true
translationSourceHash: "705d13d3cf8b4b4cfe116a16827f7ab7c4b0b793c1f44a7c86b7535d67cc7450"
translationStatus: draft
---

El componente Slider permite a los usuarios seleccionar un valor de un rango arrastrando un control a lo largo de una pista.

```tsx
import { StyledSlider, Slider } from "@solidiom/recipes-css"

;<StyledSlider defaultValue={[50]} min={0} max={100} aria-label="Volumen">
  <Slider.Track>
    <Slider.Range />
    <Slider.Thumb />
  </Slider.Track>
</StyledSlider>
```
