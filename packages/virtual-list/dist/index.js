// src/virtual-list.tsx
import { createSignal, createMemo, onSettled } from "solid-js";
import { applySemanticAttrs } from "@solidiom/runtime";

// src/virtual-list-context.ts
import { createContext, useContext } from "solid-js";
var VirtualListContext = createContext();

// src/virtual-list.tsx
function createDefaultPort() {
  return {
    getVirtualItems(config) {
      const { totalCount, itemSize, overscan = 3, scrollOffset, containerSize } = config;
      if (typeof itemSize !== "number") {
        throw new Error("[solidiom] Default virtualization port requires a fixed numeric itemSize");
      }
      const startIndex = Math.max(0, Math.floor(scrollOffset / itemSize) - overscan);
      const visibleCount = Math.ceil(containerSize / itemSize);
      const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2);
      const items = [];
      for (let i = startIndex; i <= endIndex; i++) {
        items.push({ index: i, start: i * itemSize, size: itemSize, end: (i + 1) * itemSize });
      }
      return items;
    },
    getTotalSize(config) {
      const { totalCount, itemSize } = config;
      if (typeof itemSize !== "number") {
        throw new Error("[solidiom] Default virtualization port requires a fixed numeric itemSize");
      }
      return totalCount * itemSize;
    },
    scrollToIndex(index, config) {
      void index;
      void config;
    }
  };
}
function createVirtualizer(options) {
  const port = options.port ?? createDefaultPort();
  const overscan = options.overscan ?? 3;
  const [internalOffset, setInternalOffset] = createSignal(0);
  const [internalContainerSize, _setInternalContainerSize] = createSignal(0);
  const scrollOffset = () => options.scrollOffset?.() ?? internalOffset();
  const containerSize = () => options.containerSize?.() ?? internalContainerSize();
  const setScrollOffset = (offset) => {
    if (options.onScrollOffsetChange) {
      options.onScrollOffsetChange(offset);
    } else {
      setInternalOffset(offset);
    }
  };
  const config = () => ({
    totalCount: options.totalCount(),
    itemSize: options.itemSize,
    overscan,
    scrollOffset: scrollOffset(),
    containerSize: containerSize()
  });
  const virtualItems = createMemo(() => port.getVirtualItems(config()));
  const totalSize = createMemo(() => port.getTotalSize(config()));
  const scrollToIndex = (index) => {
    port.scrollToIndex(index, config());
    if (typeof options.itemSize === "number") {
      setScrollOffset(index * options.itemSize);
    }
  };
  return {
    virtualItems,
    totalSize,
    scrollOffset,
    containerSize,
    setScrollOffset,
    scrollToIndex
  };
}
function Root(props) {
  const port = props.port ?? createDefaultPort();
  const overscan = props.overscan ?? 3;
  const [internalOffset, setInternalOffset] = createSignal(0);
  const [containerSize, setContainerSize] = createSignal(0);
  const scrollOffset = () => props.scrollOffset?.() ?? internalOffset();
  const setScrollOffset = (offset) => {
    if (props.onScrollOffsetChange) {
      props.onScrollOffsetChange(offset);
    } else {
      setInternalOffset(offset);
    }
  };
  const config = () => ({
    totalCount: props.totalCount,
    itemSize: props.itemSize,
    overscan,
    scrollOffset: scrollOffset(),
    containerSize: containerSize()
  });
  const virtualItems = createMemo(() => port.getVirtualItems(config()));
  const totalSize = createMemo(() => port.getTotalSize(config()));
  const scrollToIndex = (index) => {
    port.scrollToIndex(index, config());
    if (typeof props.itemSize === "number") {
      setScrollOffset(index * props.itemSize);
    }
  };
  const ctx = {
    virtualItems,
    totalSize,
    scrollOffset,
    containerSize,
    setScrollOffset,
    scrollToIndex
  };
  let rootEl;
  const handleScroll = () => {
    if (rootEl) {
      setScrollOffset(rootEl.scrollTop);
    }
  };
  onSettled(() => {
    if (rootEl) {
      setContainerSize(rootEl.clientHeight);
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerSize(entry.contentRect.height);
        }
      });
      observer.observe(rootEl);
      return () => observer.disconnect();
    }
  });
  return /* @__PURE__ */ React.createElement(VirtualListContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "list",
      ref: (el) => {
        rootEl = el;
        props.ref?.(el);
      },
      onScroll: handleScroll,
      class: props.class,
      style: `overflow:auto;height:${props.height};position:relative;${typeof props.style === "string" ? props.style : ""}`,
      ...applySemanticAttrs({ scope: "virtual-list", part: "root" })
    },
    /* @__PURE__ */ React.createElement("div", { style: `height:${totalSize()}px;width:100%;position:relative;`, "aria-hidden": "true" }),
    props.children(virtualItems)
  ));
}
function Item(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "listitem",
      class: props.class,
      style: `position:absolute;top:0;left:0;width:100%;height:${props.item.size}px;transform:translateY(${props.item.start}px);${typeof props.style === "string" ? props.style : ""}`,
      ...applySemanticAttrs({ scope: "virtual-list", part: "item" })
    },
    props.children
  );
}
export {
  Item,
  Root,
  createVirtualizer
};
//# sourceMappingURL=index.js.map