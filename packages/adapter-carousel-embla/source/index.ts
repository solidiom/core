/**
 * @solidiom/adapter-carousel-embla — Carousel physics adapter using Embla Carousel.
 *
 * Implements CarouselPhysicsCapability@1. The Embla instance is never
 * exposed through the primitive API (statically verified).
 */

import type { EmblaCarouselType as _EmblaType } from "embla-carousel"

export type {
  CarouselPhysicsCapability,
  CarouselGeometry,
  CarouselPhysicsResult,
} from "./capability"
export { createEmblaCarouselAdapter } from "./adapter"
