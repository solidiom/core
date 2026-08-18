---
contentSchemaVersion: 1
title: Carrusel básico
description: Contenedor desplazable para mostrar contenido en un área de visualización fija.
keywords: [carousel, slider, viewport, scroll, gallery]
locale: es
maturity: draft
product: Carousel
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "carousel"
section: examples
exampleId: carousel-component-basic
source:
  path: apps/site/src/components/CarouselExample.tsx
  export: CarouselExample
  language: tsx
  runnable: true
translationSourceHash: "c62eba75f252232e303ea8e80669e1d4aec2cb9b11148eb0082be20e5a8c52a5"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Carousel proporciona un contenedor desplazable para mostrar contenido en un área de visualización fija.

```tsx
import { StyledCarousel, Carousel } from "@solidiom/recipes-css"

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
