// src/index.tsx
import { createSignal, createContext, useContext, onSettled } from "solid-js";
import { Show } from "@solidjs/web";
import { applySemanticAttrs } from "@solidiom/runtime";
var ScrollAreaContext = createContext();
function useScrollAreaContext() {
  const ctx = useContext(ScrollAreaContext);
  if (!ctx) {
    throw new Error("[solidiom] ScrollArea parts must be used within ScrollArea.Root");
  }
  return ctx;
}
function Root(props) {
  const type = props.type ?? "hover";
  const scrollHideDelay = props.scrollHideDelay ?? 600;
  const [viewportRef, setViewportRef] = createSignal(void 0);
  const [scrollHeight, setScrollHeight] = createSignal(0);
  const [scrollWidth, setScrollWidth] = createSignal(0);
  const [viewportHeight, setViewportHeight] = createSignal(0);
  const [viewportWidth, setViewportWidth] = createSignal(0);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [scrollLeft, setScrollLeft] = createSignal(0);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isScrolling, setIsScrolling] = createSignal(false);
  let scrollTimer;
  const updateMeasurements = () => {
    const el = viewportRef();
    if (!el) return;
    setScrollHeight(el.scrollHeight);
    setScrollWidth(el.scrollWidth);
    setViewportHeight(el.clientHeight);
    setViewportWidth(el.clientWidth);
  };
  const updateScrollPosition = () => {
    const el = viewportRef();
    if (!el) return;
    setScrollTop(el.scrollTop);
    setScrollLeft(el.scrollLeft);
  };
  const notifyScrollStart = () => {
    setIsScrolling(true);
    if (scrollTimer !== void 0) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      setIsScrolling(false);
    }, scrollHideDelay);
  };
  return /* @__PURE__ */ React.createElement(
    ScrollAreaContext,
    {
      value: {
        viewportRef,
        setViewportRef,
        scrollHeight,
        scrollWidth,
        viewportHeight,
        viewportWidth,
        scrollTop,
        scrollLeft,
        type,
        isHovered,
        isScrolling,
        scrollHideDelay,
        updateMeasurements,
        updateScrollPosition,
        notifyScrollStart
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        class: props.class,
        style: {
          position: "relative",
          overflow: "hidden",
          ...typeof props.style === "object" ? props.style : {}
        },
        onPointerEnter: () => setIsHovered(true),
        onPointerLeave: () => setIsHovered(false),
        ...applySemanticAttrs({
          scope: "scroll-area",
          part: "root"
        })
      },
      props.children
    )
  );
}
function Viewport(props) {
  const ctx = useScrollAreaContext();
  let ref;
  onSettled(() => {
    if (!ref) return;
    ctx.setViewportRef(ref);
    ctx.updateMeasurements();
    const observer = new ResizeObserver(() => ctx.updateMeasurements());
    observer.observe(ref);
    return () => {
      observer.disconnect();
      ctx.setViewportRef(void 0);
    };
  });
  const handleScroll = () => {
    ctx.updateScrollPosition();
    ctx.notifyScrollStart();
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      onScroll: handleScroll,
      class: props.class,
      style: {
        "overflow-x": "scroll",
        "overflow-y": "scroll",
        "scrollbar-width": "none",
        ...typeof props.style === "object" ? props.style : {}
      },
      ...applySemanticAttrs({
        scope: "scroll-area",
        part: "viewport"
      })
    },
    props.children
  );
}
function Scrollbar(props) {
  const ctx = useScrollAreaContext();
  const orientation = () => props.orientation ?? "vertical";
  const isVisible = () => {
    if (ctx.type === "always") return true;
    if (ctx.type === "hover") return ctx.isHovered();
    if (ctx.type === "scroll") return ctx.isScrolling();
    if (orientation() === "vertical") {
      return ctx.scrollHeight() > ctx.viewportHeight();
    }
    return ctx.scrollWidth() > ctx.viewportWidth();
  };
  return /* @__PURE__ */ React.createElement(Show, { when: isVisible() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: {
        position: "absolute",
        ...orientation() === "vertical" ? { top: "0", right: "0", bottom: "0", width: "8px" } : { bottom: "0", left: "0", right: "0", height: "8px" },
        ...typeof props.style === "object" ? props.style : {}
      },
      ...applySemanticAttrs({
        scope: "scroll-area",
        part: "scrollbar",
        orientation: orientation()
      })
    },
    props.children
  ));
}
function Thumb(props) {
  const ctx = useScrollAreaContext();
  const thumbSize = () => {
    const vh = ctx.viewportHeight();
    const sh = ctx.scrollHeight();
    if (sh === 0) return 100;
    return Math.max(vh / sh * 100, 10);
  };
  const thumbOffset = () => {
    const sh = ctx.scrollHeight();
    const vh = ctx.viewportHeight();
    const st = ctx.scrollTop();
    if (sh <= vh) return 0;
    return st / (sh - vh) * (100 - thumbSize());
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: {
        position: "absolute",
        "border-radius": "9999px",
        background: "rgba(0, 0, 0, 0.3)",
        width: "100%",
        height: `${thumbSize()}%`,
        top: `${thumbOffset()}%`,
        transition: "opacity 150ms",
        ...typeof props.style === "object" ? props.style : {}
      },
      ...applySemanticAttrs({
        scope: "scroll-area",
        part: "thumb"
      })
    }
  );
}
export {
  Root,
  Scrollbar,
  Thumb,
  Viewport
};
//# sourceMappingURL=index.js.map