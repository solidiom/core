/**
 * @solidiom/carousel — Headless carousel primitive.
 *
 * Parts: Root, Viewport, Slide, PrevButton, NextButton.
 * Supports scroll-snap, pointer drag-to-swipe, keyboard nav, loop mode, auto-play.
 *
 * @example
 * ```tsx
 * import * as Carousel from "@solidiom/carousel"
 *
 * const geometry = { slideCount: 5, slideWidth: 300, gap: 16, containerWidth: 900 }
 *
 * <Carousel.Root geometry={geometry} loop>
 *   <Carousel.Viewport>
 *     <Carousel.Slide index={0}>Slide 1</Carousel.Slide>
 *     <Carousel.Slide index={1}>Slide 2</Carousel.Slide>
 *   </Carousel.Viewport>
 *   <Carousel.PrevButton />
 *   <Carousel.NextButton />
 * </Carousel.Root>
 * ```
 */
export { Root, Viewport, Slide, PrevButton, NextButton, simpleSnapPhysics } from "./carousel";
export type { CarouselRootProps, CarouselViewportProps, CarouselSlideProps, CarouselPrevButtonProps, CarouselNextButtonProps, } from "./carousel";
export { useCarouselContext, type CarouselContextValue, type CarouselGeometry, type CarouselPhysicsPort, type CarouselPhysicsResult, } from "./carousel-context";
//# sourceMappingURL=index.d.ts.map