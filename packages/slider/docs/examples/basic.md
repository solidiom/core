---
contentSchemaVersion: 1
title: Slider - Basic usage
description: Basic slider example demonstrating core behavior.
keywords: [slider, basic, example]
locale: en
maturity: draft
product: Slider
productLayer: primitive
status: draft
package: "@solidiom/slider"
primitive: slider
section: examples
exampleId: slider-basic
source:
  path: packages/slider/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Slider from "@solidiom/slider"

;<Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
    <Slider.Thumb index={0} aria-label="Volume" />
  </Slider.Track>
</Slider.Root>
```

## Range slider

```tsx
;<Slider.Root defaultValue={[25, 75]} min={0} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
    <Slider.Thumb index={0} aria-label="Minimum value" />
    <Slider.Thumb index={1} aria-label="Maximum value" />
  </Slider.Track>
</Slider.Root>
```

Each thumb is identified by its `index` in the value array. The Range fills between the minimum and maximum thumb positions. Use the `orientation` prop for vertical layout.
