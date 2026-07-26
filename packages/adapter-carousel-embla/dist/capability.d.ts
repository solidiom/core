/** CarouselPhysicsCapability@1 port shape (same as test-doubles). */
export interface CarouselGeometry {
    slideCount: number;
    slideWidth: number;
    gap: number;
    containerWidth: number;
}
export interface CarouselPhysicsResult {
    selectedIndex: number;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    scrollPosition: number;
    snapPoints: number[];
}
export interface CarouselPhysicsCapability {
    compute(geometry: CarouselGeometry, selectedIndex: number): CarouselPhysicsResult;
    nearestSnap(geometry: CarouselGeometry, scrollPosition: number): number;
    destroy(): void;
}
//# sourceMappingURL=capability.d.ts.map