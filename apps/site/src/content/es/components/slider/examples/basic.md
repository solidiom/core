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
source:
  path: apps/site/src/components/SliderExample.tsx
  export: SliderExample
  language: tsx
runnable: true
translationSourceHash: "825cbf13ebef839d112af7342037d206b7ae8ecad49cf8bc5ce0f2fcaa07343e"
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
