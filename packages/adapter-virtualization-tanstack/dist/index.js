// src/index.ts
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect
} from "@tanstack/virtual-core";
function createTanStackVirtualAdapter() {
  function compute(input) {
    const { totalCount, itemSize, viewportHeight, scrollOffset, overscan = 3 } = input;
    const virtualizer = new Virtualizer({
      count: totalCount,
      getScrollElement: () => null,
      estimateSize: () => itemSize,
      overscan,
      scrollToFn: () => {
      },
      observeElementRect,
      observeElementOffset,
      scrollRect: { width: 0, height: viewportHeight },
      scrollOffset
    });
    virtualizer.measure();
    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();
    const items = virtualItems.map((vi) => ({
      index: vi.index,
      start: vi.start,
      end: vi.end,
      size: vi.size
    }));
    const startIndex = items.length > 0 ? items[0].index : 0;
    const endIndex = items.length > 0 ? items[items.length - 1].index : 0;
    return { items, totalSize, startIndex, endIndex };
  }
  return { compute, destroy: () => {
  } };
}
function createTanStackVirtualScroller(options) {
  const virtualizer = new Virtualizer({
    count: options.count,
    getScrollElement: options.getScrollElement,
    estimateSize: options.estimateSize,
    overscan: options.overscan ?? 3,
    horizontal: options.horizontal ?? false,
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll
  });
  return {
    getVirtualItems() {
      return virtualizer.getVirtualItems().map((vi) => ({
        index: vi.index,
        start: vi.start,
        end: vi.end,
        size: vi.size
      }));
    },
    getTotalSize() {
      return virtualizer.getTotalSize();
    },
    scrollToIndex(index, opts) {
      virtualizer.scrollToIndex(index, opts);
    },
    setCount(count) {
      virtualizer.setOptions({ ...virtualizer.options, count });
      virtualizer.measure();
    },
    destroy() {
      virtualizer.scrollElement = null;
    }
  };
}
export {
  createTanStackVirtualAdapter,
  createTanStackVirtualScroller
};
//# sourceMappingURL=index.js.map