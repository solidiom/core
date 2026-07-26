// src/adapter.ts
function createEmblaCarouselAdapter() {
  const getSnapPoints = (g) => {
    const points = [];
    for (let i = 0; i < g.slideCount; i++) points.push(i * (g.slideWidth + g.gap));
    return points;
  };
  const compute = (geometry, selectedIndex) => {
    const snapPoints = getSnapPoints(geometry);
    const clamped = Math.max(0, Math.min(selectedIndex, geometry.slideCount - 1));
    return {
      selectedIndex: clamped,
      canScrollPrev: clamped > 0,
      canScrollNext: clamped < geometry.slideCount - 1,
      scrollPosition: snapPoints[clamped] ?? 0,
      snapPoints
    };
  };
  const nearestSnap = (geometry, scrollPosition) => {
    const snapPoints = getSnapPoints(geometry);
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < snapPoints.length; i++) {
      const dist = Math.abs(snapPoints[i] - scrollPosition);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    return nearest;
  };
  return { compute, nearestSnap, destroy: () => {
  } };
}
export {
  createEmblaCarouselAdapter
};
//# sourceMappingURL=index.js.map