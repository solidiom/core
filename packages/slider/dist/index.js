// src/slider.tsx
import { createSignal, onCleanup } from "solid-js";
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  composeEventHandlers
} from "@solidiom/runtime";

// src/slider-context.ts
import { createContext, useContext } from "solid-js";
var SliderContext = createContext();
function useSliderContext() {
  const ctx = useContext(SliderContext);
  if (!ctx) {
    throw new Error("[solidiom/slider] useSliderContext must be used within a Slider.Root");
  }
  return ctx;
}

// src/slider.tsx
function clamp(value, min, max, step) {
  const clamped = Math.min(Math.max(value, min), max);
  const stepped = Math.round((clamped - min) / step) * step + min;
  return Math.min(stepped, max);
}
function positionToValue(position, trackRect, min, max, step, orientation) {
  const trackSize = orientation === "horizontal" ? trackRect.width : trackRect.height;
  const offset = orientation === "horizontal" ? position - trackRect.left : trackRect.bottom - position;
  const ratio = Math.min(Math.max(offset / trackSize, 0), 1);
  const raw = min + ratio * (max - min);
  return clamp(raw, min, max, step);
}
function Root(props) {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const orientation = props.orientation ?? "horizontal";
  const disabled = () => props.disabled ?? false;
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? [min],
    onChange: (next) => props.onValueChange?.(next),
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  });
  const [trackRef, setTrackRef] = createSignal(void 0);
  const getPercentage = (val) => {
    if (max === min) return 0;
    return (val - min) / (max - min) * 100;
  };
  const requestValueChange = (index, next, reason) => {
    const current = value();
    const clamped = clamp(next, min, max, step);
    const updated = [...current];
    updated[index] = clamped;
    requestChange(updated, createChangeDetails(reason));
  };
  const contextValue = {
    values: value,
    min,
    max,
    step,
    disabled,
    orientation,
    requestValueChange,
    getPercentage,
    trackRef,
    setTrackRef
  };
  return /* @__PURE__ */ React.createElement(SliderContext, { value: contextValue }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      "aria-label": "Slider",
      class: props.class,
      ...applySemanticAttrs({
        scope: "slider",
        part: "root",
        disabled: disabled(),
        orientation
      })
    },
    props.children
  ));
}
function Track(props) {
  const ctx = useSliderContext();
  const handlePointerDown = (event) => {
    if (ctx.disabled()) return;
    if (event.button !== 0) return;
    const trackEl = ctx.trackRef();
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const newValue = positionToValue(
      ctx.orientation === "horizontal" ? event.clientX : event.clientY,
      rect,
      ctx.min,
      ctx.max,
      ctx.step,
      ctx.orientation
    );
    const values = ctx.values();
    let nearestIdx = 0;
    let nearestDist = Math.abs(values[0] - newValue);
    for (let i = 1; i < values.length; i++) {
      const dist = Math.abs(values[i] - newValue);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }
    ctx.requestValueChange(nearestIdx, newValue, "drag");
  };
  const composedPointerDown = composeEventHandlers(
    props.onPointerDown,
    handlePointerDown
  );
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: (el) => ctx.setTrackRef(el),
      onPointerDown: composedPointerDown,
      ...applySemanticAttrs({ scope: "slider", part: "track", orientation: ctx.orientation })
    },
    props.children
  );
}
function Range(props) {
  const ctx = useSliderContext();
  const index = props.index ?? 0;
  const style = () => {
    const values = ctx.values();
    const startPercent = index === 0 ? 0 : ctx.getPercentage(values[index - 1]);
    const endPercent = ctx.getPercentage(values[index] ?? values[0]);
    if (ctx.orientation === "horizontal") {
      return {
        position: "absolute",
        left: `${startPercent}%`,
        width: `${endPercent - startPercent}%`
      };
    }
    return {
      position: "absolute",
      bottom: `${startPercent}%`,
      height: `${endPercent - startPercent}%`
    };
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: style(),
      ...applySemanticAttrs({ scope: "slider", part: "range", orientation: ctx.orientation })
    }
  );
}
function Thumb(props) {
  const ctx = useSliderContext();
  const index = () => props.index ?? 0;
  const currentValue = () => ctx.values()[index()] ?? ctx.min;
  const style = () => {
    const percent = ctx.getPercentage(currentValue());
    if (ctx.orientation === "horizontal") {
      return { position: "absolute", left: `${percent}%`, translate: "-50% 0" };
    }
    return { position: "absolute", bottom: `${percent}%`, translate: "0 50%" };
  };
  const handleKeyDown = (event) => {
    if (ctx.disabled()) return;
    const val = currentValue();
    let next;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = val + ctx.step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = val - ctx.step;
        break;
      case "PageUp":
        next = val + ctx.step * 10;
        break;
      case "PageDown":
        next = val - ctx.step * 10;
        break;
      case "Home":
        next = ctx.min;
        break;
      case "End":
        next = ctx.max;
        break;
      default:
        return;
    }
    event.preventDefault();
    ctx.requestValueChange(index(), next, "keyboard");
  };
  const handlePointerDown = (event) => {
    if (ctx.disabled()) return;
    if (event.button !== 0) return;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    target.focus();
    const handlePointerMove = (moveEvent) => {
      const trackEl = ctx.trackRef();
      if (!trackEl) return;
      const rect = trackEl.getBoundingClientRect();
      const newValue = positionToValue(
        ctx.orientation === "horizontal" ? moveEvent.clientX : moveEvent.clientY,
        rect,
        ctx.min,
        ctx.max,
        ctx.step,
        ctx.orientation
      );
      ctx.requestValueChange(index(), newValue, "drag");
    };
    const handlePointerUp = () => {
      target.releasePointerCapture(event.pointerId);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
    };
    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
  };
  onCleanup(() => {
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "slider",
      tabindex: ctx.disabled() ? -1 : 0,
      "aria-valuemin": ctx.min,
      "aria-valuemax": ctx.max,
      "aria-valuenow": currentValue(),
      "aria-orientation": ctx.orientation,
      "aria-disabled": ctx.disabled() ? "true" : void 0,
      "aria-label": props["aria-label"],
      style: style(),
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      ...applySemanticAttrs({
        scope: "slider",
        part: "thumb",
        disabled: ctx.disabled(),
        orientation: ctx.orientation
      })
    },
    props.children
  );
}
export {
  Range,
  Root,
  Thumb,
  Track,
  useSliderContext
};
//# sourceMappingURL=index.js.map