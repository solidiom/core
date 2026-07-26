/**
 * Deterministic carousel physics test double — implements CarouselPhysicsCapability@1.
 *
 * Returns snap positions and slide state based on container/slide geometry.
 * Zero engine dependencies. Deterministic for fixed input.
 */
/** Input describing carousel geometry. */
export interface CarouselGeometry {
    /** Total number of slides. */
    slideCount: number;
    /** Width of each slide (uniform). */
    slideWidth: number;
    /** Gap between slides. */
    gap: number;
    /** Container (viewport) width. */
    containerWidth: number;
}
/** Result of a carousel physics computation. */
export interface CarouselPhysicsResult {
    /** Current selected slide index. */
    selectedIndex: number;
    /** Whether previous navigation is possible. */
    canScrollPrev: boolean;
    /** Whether next navigation is possible. */
    canScrollNext: boolean;
    /** Scroll position for the selected slide. */
    scrollPosition: number;
    /** All snap point positions. */
    snapPoints: number[];
}
/** CarouselPhysicsCapability@1 port shape. */
export interface CarouselPhysicsCapability {
    /** Compute state for a given selected index. */
    compute(geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult;
    /** Get the nearest snap index for a scroll position. */
    nearestSnap(geometry: CarouselGeometry, scrollPosition: number): number;
    destroy(): void;
}
/**
 * Deterministic carousel physics double.
 *
 * Simple snap-to-slide positioning without momentum, drag, or spring physics.
 */
export declare function createCarouselPhysicsDouble(): CarouselPhysicsCapability;
//# sourceMappingURL=carousel-physics.d.ts.map