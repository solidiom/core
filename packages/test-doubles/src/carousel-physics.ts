/**
 * Deterministic carousel physics test double — implements CarouselPhysicsCapability@1.
 *
 * Returns snap positions and slide state based on container/slide geometry.
 * Zero engine dependencies. Deterministic for fixed input.
 */

/** Input describing carousel geometry. */
export interface CarouselGeometry {
  /** Total number of slides. */
  slideCount: number
  /** Width of each slide (uniform). */
  slideWidth: number
  /** Gap between slides. */
  gap: number
  /** Container (viewport) width. */
  containerWidth: number
}

/** Result of a carousel physics computation. */
export interface CarouselPhysicsResult {
  /** Current selected slide index. */
  selectedIndex: number
  /** Whether previous navigation is possible. */
  canScrollPrev: boolean
  /** Whether next navigation is possible. */
  canScrollNext: boolean
  /** Scroll position for the selected slide. */
  scrollPosition: number
  /** All snap point positions. */
  snapPoints: number[]
}

/** CarouselPhysicsCapability@1 port shape. */
export interface CarouselPhysicsCapability {
  /** Compute state for a given selected index. */
  compute(geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult
  /** Get the nearest snap index for a scroll position. */
  nearestSnap(geometry: CarouselGeometry, scrollPosition: number): number
  destroy(): void
}

/**
 * Deterministic carousel physics double.
 *
 * Simple snap-to-slide positioning without momentum, drag, or spring physics.
 */
export function createCarouselPhysicsDouble(): CarouselPhysicsCapability {
  const getSnapPoints = (geometry: CarouselGeometry): number[] => {
    const { slideCount, slideWidth, gap } = geometry
    const points: number[] = []
    for (let i = 0; i < slideCount; i++) {
      points.push(i * (slideWidth + gap))
    }
    return points
  }

  const compute = (geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult => {
    const { slideCount } = geometry
    const snapPoints = getSnapPoints(geometry)
    const clamped = Math.max(0, Math.min(selectedIndex, slideCount - 1))

    return {
      selectedIndex: clamped,
      canScrollPrev: clamped > 0,
      canScrollNext: clamped < slideCount - 1,
      scrollPosition: snapPoints[clamped] ?? 0,
      snapPoints,
    }
  }

  const nearestSnap = (geometry: CarouselGeometry, scrollPosition: number): number => {
    const snapPoints = getSnapPoints(geometry)
    let nearest = 0
    let minDist = Infinity
    for (let i = 0; i < snapPoints.length; i++) {
      const dist = Math.abs(snapPoints[i]! - scrollPosition)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    }
    return nearest
  }

  const destroy = (): void => {}

  return { compute, nearestSnap, destroy }
}
