---
contentSchemaVersion: 1
title: Carousel - Basic usage
description: Basic carousel example demonstrating core behavior.
keywords: [carousel, basic, example]
locale: en
maturity: draft
product: Carousel
productLayer: primitive
status: draft
package: "@solidiom/carousel"
primitive: carousel
section: examples
exampleId: carousel-basic
source:
  path: packages/carousel/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Carousel from "@solidiom/carousel"

const geometry = {
  slideCount: 5,
  slideWidth: 300,
  gap: 16,
  containerWidth: 900,
}

;<Carousel.Root geometry={geometry} loop onIndexChange={(i) => console.log(i)}>
  <Carousel.Viewport>
    <Carousel.Slide index={0}>Slide 1</Carousel.Slide>
    <Carousel.Slide index={1}>Slide 2</Carousel.Slide>
    <Carousel.Slide index={2}>Slide 3</Carousel.Slide>
    <Carousel.Slide index={3}>Slide 4</Carousel.Slide>
    <Carousel.Slide index={4}>Slide 5</Carousel.Slide>
  </Carousel.Viewport>

  <Carousel.PrevButton />
  <Carousel.NextButton />
</Carousel.Root>
```

The carousel supports pointer drag-to-swipe, keyboard navigation, and loop mode. Set the `autoPlay` prop (in milliseconds) on Root for automatic advancement.
