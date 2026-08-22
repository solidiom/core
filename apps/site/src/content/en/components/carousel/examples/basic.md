---
contentSchemaVersion: 1
title: Basic carousel
description: Scrollable container for displaying content in a fixed viewport.
keywords: [carousel, slider, viewport, scroll, gallery]
locale: en
maturity: draft
product: Carousel
productLayer: component
status: draft
package: "@solidiom/carousel"
section: examples
exampleId: carousel-component-basic
source:
  path: apps/site/src/components/CarouselExample.tsx
  export: CarouselExample
  language: tsx
  runnable: true
---

The Carousel component provides a scrollable container for displaying content in a fixed viewport.

```tsx
import * as Carousel from "@solidiom/carousel"

;<Carousel.Root
  physics={Carousel.simpleSnapPhysics}
  geometry={{ slideCount: 4, slideWidth: 200, gap: 16, containerWidth: 500 }}
>
  <Carousel.Viewport>
    <Carousel.Slide index={0}>
      <div>Slide 1</div>
    </Carousel.Slide>
    <Carousel.Slide index={1}>
      <div>Slide 2</div>
    </Carousel.Slide>
    <Carousel.Slide index={2}>
      <div>Slide 3</div>
    </Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.PrevButton />
  <Carousel.NextButton />
</Carousel.Root>
```
