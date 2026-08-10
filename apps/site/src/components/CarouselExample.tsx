import * as Carousel from "@solidiom/carousel"
import type { Locale } from "../lib/locale"

export interface CarouselExampleProps {
  locale: Locale
}

const SLIDES = [0, 1, 2, 3]

/** Canonical executable source for the Carousel documentation example. */
export function CarouselExample(props: CarouselExampleProps) {
  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="carousel-example"
      data-carousel-example
    >
      <Carousel.Root
        physics={Carousel.simpleSnapPhysics}
        geometry={{ slideCount: SLIDES.length, slideWidth: 180, gap: 12, containerWidth: 480 }}
      >
        <Carousel.Viewport>
          {SLIDES.map((index) => (
            <Carousel.Slide index={index}>
              <div class="carousel-example__slide">Slide {index + 1}</div>
            </Carousel.Slide>
          ))}
        </Carousel.Viewport>
        <Carousel.PrevButton />
        <Carousel.NextButton />
      </Carousel.Root>
    </div>
  )
}
