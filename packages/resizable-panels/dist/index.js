// src/panels.tsx
import { createSignal, onCleanup, untrack } from "solid-js";
import {
  createControllableValue,
  createStableId,
  createChangeDetails,
  applySemanticAttrs
} from "@solidiom/runtime";

// src/panels-context.ts
import { createContext, useContext } from "solid-js";
var PanelGroupContext = createContext();
function usePanelGroupContext() {
  const ctx = useContext(PanelGroupContext);
  if (!ctx) {
    throw new Error("[solidiom] Panel/Handle must be used within PanelGroup");
  }
  return ctx;
}

// src/panels.tsx
function PanelGroup(props) {
  const direction = () => props.direction ?? "horizontal";
  const baseId = createStableId("panels");
  const [panels, setPanels] = createSignal([], { ownedWrite: true });
  const { value: sizes, requestChange: requestSizeChange } = createControllableValue({
    value: props.sizes,
    defaultValue: props.defaultSizes ?? [],
    onChange: props.onSizesChange,
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  });
  const registerPanel = (entry) => {
    setPanels((prev) => {
      const next = [...prev, entry].sort((a, b) => a.order - b.order);
      return next;
    });
    const currentSizes = untrack(sizes);
    if (entry.constraints.defaultSize !== void 0) {
      const panelList = [...untrack(panels), entry].sort((a, b) => a.order - b.order);
      const idx = panelList.findIndex((p) => p.id === entry.id);
      if (idx >= 0 && (currentSizes.length <= idx || currentSizes[idx] === void 0)) {
        const updated = [...currentSizes];
        while (updated.length <= idx) updated.push(0);
        updated[idx] = entry.constraints.defaultSize;
        untrack(() => requestSizeChange(updated, createChangeDetails("programmatic")));
      }
    }
    return () => {
      setPanels((prev) => prev.filter((p) => p.id !== entry.id));
    };
  };
  const ctx = {
    direction,
    sizes,
    requestSizeChange,
    registerPanel,
    panels,
    baseId
  };
  return /* @__PURE__ */ React.createElement(PanelGroupContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "resizable-panels",
        part: "group",
        orientation: direction()
      }),
      style: {
        display: "flex",
        "flex-direction": direction() === "horizontal" ? "row" : "column"
      }
    },
    props.children
  ));
}
function Panel(props) {
  const ctx = usePanelGroupContext();
  const panelId = createStableId("panel");
  const constraints = {
    minSize: props.minSize,
    maxSize: props.maxSize,
    defaultSize: props.defaultSize,
    collapsible: props.collapsible
  };
  const entry = {
    id: panelId,
    constraints,
    order: props.order
  };
  const cleanup = ctx.registerPanel(entry);
  onCleanup(cleanup);
  const panelIndex = () => {
    return ctx.panels().findIndex((p) => p.id === panelId);
  };
  const currentSize = () => {
    const idx = panelIndex();
    const s = ctx.sizes();
    return idx >= 0 && idx < s.length ? s[idx] : props.defaultSize ?? 50;
  };
  const isCollapsed = () => {
    return props.collapsible === true && currentSize() === 0;
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: panelId,
      ref: props.ref,
      class: props.class,
      style: typeof props.style === "string" ? `flex-basis: ${currentSize()}%; flex-grow: 0; flex-shrink: 0; overflow: hidden; ${props.style}` : {
        "flex-basis": `${currentSize()}%`,
        "flex-grow": "0",
        "flex-shrink": "0",
        overflow: "hidden",
        ...props.style
      },
      ...applySemanticAttrs({
        scope: "resizable-panels",
        part: "panel",
        state: isCollapsed() ? "collapsed" : "expanded"
      })
    },
    props.children
  );
}
function Handle(props) {
  const ctx = usePanelGroupContext();
  const handleId = createStableId("panel-handle");
  let handleEl;
  const STEP = 1;
  const SHIFT_STEP = 10;
  const beforePanel = () => ctx.panels()[props.index];
  const ariaValueNow = () => {
    const s = ctx.sizes();
    return props.index < s.length ? s[props.index] : 50;
  };
  const ariaValueMin = () => {
    const panel = beforePanel();
    return panel?.constraints.minSize ?? 0;
  };
  const ariaValueMax = () => {
    const panel = beforePanel();
    return panel?.constraints.maxSize ?? 100;
  };
  const handlePointerDown = (e) => {
    if (props.disabled) return;
    e.preventDefault();
    const el = handleEl;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const startPos = ctx.direction() === "horizontal" ? e.clientX : e.clientY;
    const parentEl = el.parentElement;
    if (!parentEl) return;
    const parentRect = parentEl.getBoundingClientRect();
    const totalSize = ctx.direction() === "horizontal" ? parentRect.width : parentRect.height;
    const startSizes = [...ctx.sizes()];
    const onPointerMove = (ev) => {
      const currentPos = ctx.direction() === "horizontal" ? ev.clientX : ev.clientY;
      const deltaPixels = currentPos - startPos;
      const deltaPercent = deltaPixels / totalSize * 100;
      const newSizes = resizeByDelta(startSizes, props.index, deltaPercent, ctx.panels());
      ctx.requestSizeChange(newSizes, createChangeDetails("pointer"));
    };
    const onPointerUp = () => {
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
  };
  const handleKeyDown = (e) => {
    if (props.disabled) return;
    const isHorizontal = ctx.direction() === "horizontal";
    const step = e.shiftKey ? SHIFT_STEP : STEP;
    let delta = 0;
    if (isHorizontal) {
      if (e.key === "ArrowLeft") delta = -step;
      else if (e.key === "ArrowRight") delta = step;
      else return;
    } else {
      if (e.key === "ArrowUp") delta = -step;
      else if (e.key === "ArrowDown") delta = step;
      else return;
    }
    e.preventDefault();
    const currentSizes = [...ctx.sizes()];
    const newSizes = resizeByDelta(currentSizes, props.index, delta, ctx.panels());
    ctx.requestSizeChange(newSizes, createChangeDetails("keyboard"));
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: handleId,
      role: "separator",
      "aria-orientation": ctx.direction() === "horizontal" ? "vertical" : "horizontal",
      "aria-valuenow": ariaValueNow(),
      "aria-valuemin": ariaValueMin(),
      "aria-valuemax": ariaValueMax(),
      "aria-disabled": props.disabled ? "true" : void 0,
      tabindex: props.disabled ? -1 : 0,
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
      class: props.class,
      ref: (el) => {
        handleEl = el;
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "resizable-panels",
        part: "handle",
        disabled: props.disabled
      })
    },
    props.children
  );
}
function resizeByDelta(sizes, handleIndex, deltaPercent, panels) {
  const result = [...sizes];
  const beforeIdx = handleIndex;
  const afterIdx = handleIndex + 1;
  if (beforeIdx >= result.length || afterIdx >= result.length) return result;
  const beforePanel = panels[beforeIdx];
  const afterPanel = panels[afterIdx];
  if (!beforePanel || !afterPanel) return result;
  const beforeMin = beforePanel.constraints.minSize ?? 0;
  const beforeMax = beforePanel.constraints.maxSize ?? 100;
  const afterMin = afterPanel.constraints.minSize ?? 0;
  const afterMax = afterPanel.constraints.maxSize ?? 100;
  let newBefore = result[beforeIdx] + deltaPercent;
  let newAfter = result[afterIdx] - deltaPercent;
  if (beforePanel.constraints.collapsible && newBefore < beforeMin && newBefore < result[beforeIdx]) {
    newAfter += newBefore;
    newBefore = 0;
  } else if (afterPanel.constraints.collapsible && newAfter < afterMin && newAfter < result[afterIdx]) {
    newBefore += newAfter;
    newAfter = 0;
  } else {
    if (newBefore < beforeMin) {
      newAfter += newBefore - beforeMin;
      newBefore = beforeMin;
    }
    if (newBefore > beforeMax) {
      newAfter += newBefore - beforeMax;
      newBefore = beforeMax;
    }
    if (newAfter < afterMin) {
      newBefore += newAfter - afterMin;
      newAfter = afterMin;
    }
    if (newAfter > afterMax) {
      newBefore += newAfter - afterMax;
      newAfter = afterMax;
    }
  }
  result[beforeIdx] = Math.max(0, newBefore);
  result[afterIdx] = Math.max(0, newAfter);
  return result;
}
export {
  Handle,
  Panel,
  PanelGroup
};
//# sourceMappingURL=index.js.map