// src/tooltip.tsx
import { Show, createSignal, onCleanup, onSettled } from "solid-js";
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  createChangeDetails
} from "@solidiom/runtime";

// src/tooltip-context.ts
import { createContext, useContext } from "solid-js";
var TooltipContext = createContext();
function useTooltipContext() {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error("[solidiom] Tooltip parts must be used within Tooltip.Root");
  }
  return ctx;
}

// src/tooltip.tsx
import { createContext as createCtx, useContext as useCtx } from "solid-js";
function Root(props) {
  const baseId = createStableId("tooltip");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const presence = createPresence({ open });
  const [triggerRef, setTriggerRef] = createSignal(void 0);
  const ctx = {
    open,
    requestOpenChange,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    phase: presence.phase,
    present: presence.present,
    positioning: props.positioning,
    triggerRef,
    setTriggerRef
  };
  const openDelay = props.openDelay ?? 700;
  const closeDelay = props.closeDelay ?? 300;
  return /* @__PURE__ */ React.createElement(TooltipDelayContext, { open: openDelay, close: closeDelay }, /* @__PURE__ */ React.createElement(TooltipContext, { value: ctx }, props.children));
}
var DelayContext = createCtx({ open: 700, close: 300 });
function TooltipDelayContext(props) {
  return /* @__PURE__ */ React.createElement(DelayContext, { value: { open: props.open, close: props.close } }, props.children);
}
function useDelayContext() {
  return useCtx(DelayContext);
}
function Trigger(props) {
  const ctx = useTooltipContext();
  const delays = useDelayContext();
  let openTimer;
  let closeTimer;
  const clearTimers = () => {
    if (openTimer !== void 0) {
      clearTimeout(openTimer);
      openTimer = void 0;
    }
    if (closeTimer !== void 0) {
      clearTimeout(closeTimer);
      closeTimer = void 0;
    }
  };
  const scheduleOpen = () => {
    clearTimers();
    openTimer = setTimeout(() => {
      ctx.requestOpenChange(true, createChangeDetails("trigger"));
    }, delays.open);
  };
  const scheduleClose = () => {
    clearTimers();
    closeTimer = setTimeout(() => {
      ctx.requestOpenChange(false, createChangeDetails("trigger"));
    }, delays.close);
  };
  const handleMouseEnter = () => scheduleOpen();
  const handleMouseLeave = () => scheduleClose();
  const handleFocus = () => {
    clearTimers();
    ctx.requestOpenChange(true, createChangeDetails("trigger"));
  };
  const handleBlur = () => {
    clearTimers();
    ctx.requestOpenChange(false, createChangeDetails("trigger"));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && ctx.open()) {
      clearTimers();
      ctx.requestOpenChange(false, createChangeDetails("escape-key"));
    }
  };
  onCleanup(clearTimers);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      id: ctx.triggerId,
      "aria-describedby": ctx.open() ? ctx.contentId : void 0,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        ctx.setTriggerRef(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "tooltip",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useTooltipContext();
  const delays = useDelayContext();
  let contentEl;
  let closeTimer;
  const handleMouseEnter = () => {
    if (closeTimer !== void 0) {
      clearTimeout(closeTimer);
      closeTimer = void 0;
    }
  };
  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => {
      ctx.requestOpenChange(false, createChangeDetails("trigger"));
    }, delays.close);
  };
  onSettled(() => {
    if (!contentEl) return;
    let cleanupPositioning;
    const reference = ctx.triggerRef();
    if (ctx.positioning && reference && contentEl) {
      const result = ctx.positioning.update(reference, contentEl);
      if (typeof result === "function") {
        cleanupPositioning = result;
      }
    }
    return () => {
      cleanupPositioning?.();
      if (closeTimer !== void 0) clearTimeout(closeTimer);
    };
  });
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "tooltip",
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "tooltip",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  ));
}
export {
  Content,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map