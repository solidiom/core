// src/carousel.tsx
import { createSignal, createMemo, createEffect } from "solid-js";
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime";

// src/carousel-context.ts
import { createContext, useContext } from "solid-js";
var CarouselContext = createContext();
function useCarouselContext() {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error("[solidiom/carousel] useCarouselContext must be used within a Carousel.Root");
  }
  return ctx;
}

// src/carousel.tsx
var simpleSnapPhysics = {
  compute(geometry, selectedIndex) {
    const { slideCount, slideWidth, gap } = geometry;
    const scrollPosition = selectedIndex * (slideWidth + gap);
    const snapPoints = Array.from({ length: slideCount }, (_, i) => i * (slideWidth + gap));
    return {
      selectedIndex,
      canScrollPrev: selectedIndex > 0,
      canScrollNext: selectedIndex < slideCount - 1,
      scrollPosition,
      snapPoints
    };
  },
  nearestSnap(geometry, scrollPosition) {
    const stride = geometry.slideWidth + geometry.gap;
    if (stride === 0) return 0;
    const raw = Math.round(scrollPosition / stride);
    return Math.max(0, Math.min(raw, geometry.slideCount - 1));
  }
};
function Root(props) {
  const physics = props.physics ?? simpleSnapPhysics;
  const geometry = props.geometry;
  const loop = props.loop ?? false;
  const { value: selectedIndex, requestChange } = createControllableValue({
    value: props.selectedIndex,
    defaultValue: props.defaultIndex ?? 0,
    onChange: (next2) => props.onIndexChange?.(next2)
  });
  const [paused, setPaused] = createSignal(false);
  const computed = createMemo(
    () => physics.compute(geometry, selectedIndex())
  );
  const canScrollPrev = () => loop || computed().canScrollPrev;
  const canScrollNext = () => loop || computed().canScrollNext;
  const goTo = (index) => {
    let target = index;
    if (loop) {
      target = (index % geometry.slideCount + geometry.slideCount) % geometry.slideCount;
    } else {
      target = Math.max(0, Math.min(index, geometry.slideCount - 1));
    }
    requestChange(target, createChangeDetails("nav"));
  };
  const prev = () => goTo(selectedIndex() - 1);
  const next = () => goTo(selectedIndex() + 1);
  if (props.autoPlay && props.autoPlay > 0) {
    const interval = props.autoPlay;
    createEffect(
      () => paused(),
      (isPaused) => {
        if (isPaused) return;
        const id = setInterval(() => next(), interval);
        return () => clearInterval(id);
      }
    );
  }
  const contextValue = {
    selectedIndex,
    canScrollPrev,
    canScrollNext,
    goTo,
    prev,
    next,
    loop,
    geometry,
    physics,
    paused,
    setPaused
  };
  return /* @__PURE__ */ React.createElement(CarouselContext, { value: contextValue }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": "Carousel",
      class: props.class,
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      ...applySemanticAttrs({ scope: "carousel", part: "root" })
    },
    props.children
  ));
}
function Viewport(props) {
  const ctx = useCarouselContext();
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDragging = false;
  const scrollStyle = () => {
    const pos = ctx.physics.compute(ctx.geometry, ctx.selectedIndex()).scrollPosition;
    return {
      display: "flex",
      gap: `${ctx.geometry.gap}px`,
      transform: `translateX(-${pos}px)`,
      transition: isDragging ? "none" : "transform 300ms ease",
      "scroll-snap-type": "x mandatory"
    };
  };
  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = ctx.physics.compute(ctx.geometry, ctx.selectedIndex()).scrollPosition;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (_event) => {
    if (!isDragging) return;
  };
  const handlePointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    const delta = dragStartX - event.clientX;
    const newScroll = dragStartScroll + delta;
    const snapIndex = ctx.physics.nearestSnap(ctx.geometry, newScroll);
    ctx.goTo(snapIndex);
  };
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        ctx.prev();
        break;
      case "ArrowRight":
        event.preventDefault();
        ctx.next();
        break;
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      tabindex: 0,
      role: "group",
      "aria-live": "polite",
      style: { overflow: "hidden", cursor: isDragging ? "grabbing" : "grab" },
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onKeyDown: handleKeyDown,
      ...applySemanticAttrs({ scope: "carousel", part: "viewport" })
    },
    /* @__PURE__ */ React.createElement("div", { style: scrollStyle() }, props.children)
  );
}
function Slide(props) {
  const ctx = useCarouselContext();
  const isActive = () => ctx.selectedIndex() === props.index;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      "aria-roledescription": "slide",
      "aria-label": `Slide ${props.index + 1} of ${ctx.geometry.slideCount}`,
      "aria-hidden": !isActive() ? "true" : void 0,
      style: {
        "min-width": `${ctx.geometry.slideWidth}px`,
        "scroll-snap-align": "start"
      },
      ...applySemanticAttrs({
        scope: "carousel",
        part: "slide",
        state: isActive() ? "active" : "inactive"
      })
    },
    props.children
  );
}
function PrevButton(props) {
  const ctx = useCarouselContext();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-label": "Previous slide",
      disabled: !ctx.canScrollPrev(),
      onClick: () => ctx.prev(),
      ...applySemanticAttrs({
        scope: "carousel",
        part: "prev-button",
        disabled: !ctx.canScrollPrev()
      })
    },
    props.children ?? "\u2190"
  );
}
function NextButton(props) {
  const ctx = useCarouselContext();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-label": "Next slide",
      disabled: !ctx.canScrollNext(),
      onClick: () => ctx.next(),
      ...applySemanticAttrs({
        scope: "carousel",
        part: "next-button",
        disabled: !ctx.canScrollNext()
      })
    },
    props.children ?? "\u2192"
  );
}
export {
  NextButton,
  PrevButton,
  Root,
  Slide,
  Viewport,
  simpleSnapPhysics,
  useCarouselContext
};
//# sourceMappingURL=index.js.map