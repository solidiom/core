/**
 * Embla carousel adapter — wraps engine behind CarouselPhysicsCapability@1.
 * Embla instance is internal — never exposed to primitives.
 */

import type {
  CarouselPhysicsCapability,
  CarouselGeometry,
  CarouselPhysicsResult,
} from "./capability"

/** Creates the Embla carousel physics adapter. Synchronous arithmetic fallback. */
export function createEmblaCarouselAdapter(): CarouselPhysicsCapability {
  const getSnapPoints = (g: CarouselGeometry): number[] => {
    const points: number[] = []
    for (let i = 0; i < g.slideCount; i++) points.push(i * (g.slideWidth + g.gap))
    return points
  }

  const compute = (geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult => {
    const snapPoints = getSnapPoints(geometry)
    const clamped = Math.max(0, Math.min(selectedIndex, geometry.slideCount - 1))
    return {
      selectedIndex: clamped,
      canScrollPrev: clamped > 0,
      canScrollNext: clamped < geometry.slideCount - 1,
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

  return { compute, nearestSnap, destroy: () => {} }
}
