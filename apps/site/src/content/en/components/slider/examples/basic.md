---
contentSchemaVersion: 1
title: "Slider – Basic Example"
description: "A basic example of the Slider component for selecting a value from a range."
keywords: ["slider", "range", "input", "thumb", "track"]
locale: en
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
---

The Slider component allows users to select a value from a range by dragging a thumb along a track.

```tsx
import { StyledSlider, Slider } from "@solidiom/recipes-css"

;<StyledSlider defaultValue={[50]} min={0} max={100} aria-label="Volume">
  <Slider.Track>
    <Slider.Range />
    <Slider.Thumb />
  </Slider.Track>
</StyledSlider>
```
