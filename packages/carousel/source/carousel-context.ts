/**
 * @solidiom/carousel — Carousel context.
 *
 * Provides shared carousel state, navigation, and physics to all carousel parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Geometry descriptor for the carousel layout. */
export interface CarouselGeometry {
  slideCount: number
  slideWidth: number
  gap: number
  containerWidth: number
}

/** Result from physics computation. */
export interface CarouselPhysicsResult {
  selectedIndex: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPosition: number
  snapPoints: number[]
}

/** Port interface for carousel physics/snap computation. */
export interface CarouselPhysicsPort {
  /** Computes scroll state for a given index. */
  compute(geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult
  /** Finds nearest snap index for a given scroll position. */
  nearestSnap(geometry: CarouselGeometry, scrollPosition: number): number
}

/** Context shape shared among all carousel parts. */
export interface CarouselContextValue {
  /** Currently selected slide index. */
  selectedIndex: Accessor<number>
  /** Whether scrolling to previous is possible. */
  canScrollPrev: Accessor<boolean>
  /** Whether scrolling to next is possible. */
  canScrollNext: Accessor<boolean>
  /** Navigate to a specific slide index. */
  goTo: (index: number) => void
  /** Navigate to previous slide. */
  prev: () => void
  /** Navigate to next slide. */
  next: () => void
  /** Whether loop mode is enabled. */
  loop: boolean
  /** The geometry configuration. */
  geometry: CarouselGeometry
  /** The physics port. */
  physics: CarouselPhysicsPort
  /** Whether the carousel is paused (autoplay). */
  paused: Accessor<boolean>
  /** Set paused state. */
  setPaused: (paused: boolean) => void
}

const CarouselContext = createContext<CarouselContextValue>()

/**
 * Provides carousel context to descendant parts.
 *
 * @internal Used by Root to supply context.
 */
export { CarouselContext }

/**
 * Consumes the carousel context. Throws if used outside a CarouselRoot.
 */
export function useCarouselContext(): CarouselContextValue {
  const ctx = useContext(CarouselContext)
  if (!ctx) {
    throw new Error("[solidiom/carousel] useCarouselContext must be used within a Carousel.Root")
  }
  return ctx
}
