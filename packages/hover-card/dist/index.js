// src/hover-card.tsx
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { applySemanticAttrs, createStableId } from "@solidiom/runtime";

// src/hover-card-context.ts
import { createContext, useContext } from "solid-js";
var HoverCardContext = createContext();
function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) {
    throw new Error("[solidiom] HoverCard parts must be used within HoverCard.Root");
  }
  return ctx;
}

// src/hover-card.tsx
function Root(props) {
  const openDelay = () => props.openDelay ?? 700;
  const closeDelay = () => props.closeDelay ?? 300;
  const [open, setOpen] = createSignal(false);
  const [triggerRef, setTriggerRef] = createSignal(void 0);
  let openTimer;
  let closeTimer;
  const baseId = createStableId("hover-card");
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  function clearTimers() {
    if (openTimer !== void 0) {
      clearTimeout(openTimer);
      openTimer = void 0;
    }
    if (closeTimer !== void 0) {
      clearTimeout(closeTimer);
      closeTimer = void 0;
    }
  }
  function scheduleOpen() {
    clearTimers();
    openTimer = setTimeout(() => setOpen(true), openDelay());
  }
  function scheduleClose() {
    clearTimers();
    closeTimer = setTimeout(() => setOpen(false), closeDelay());
  }
  onCleanup(clearTimers);
  const ctx = {
    open,
    onTriggerEnter: scheduleOpen,
    onTriggerLeave: scheduleClose,
    onContentEnter: () => clearTimers(),
    onContentLeave: scheduleClose,
    contentId,
    triggerId,
    positioning: props.positioning,
    triggerRef,
    setTriggerRef
  };
  return /* @__PURE__ */ React.createElement(HoverCardContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useHoverCardContext();
  const attrs = () => applySemanticAttrs({
    scope: "hover-card",
    part: "trigger",
    state: ctx.open() ? "open" : "closed"
  });
  const setRef = (el) => ctx.setTriggerRef(el);
  if (props.href !== void 0) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        id: ctx.triggerId,
        href: props.href,
        class: props.class,
        "aria-describedby": ctx.open() ? ctx.contentId : void 0,
        onPointerEnter: () => ctx.onTriggerEnter(),
        onPointerLeave: () => ctx.onTriggerLeave(),
        ref: setRef,
        ...attrs()
      },
      props.children
    );
  }
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      id: ctx.triggerId,
      class: props.class,
      "aria-describedby": ctx.open() ? ctx.contentId : void 0,
      onPointerEnter: () => ctx.onTriggerEnter(),
      onPointerLeave: () => ctx.onTriggerLeave(),
      ref: setRef,
      ...attrs()
    },
    props.children
  );
}
function Content(props) {
  const ctx = useHoverCardContext();
  const [contentEl, setContentEl] = createSignal(void 0);
  createEffect(
    () => ctx.open() ? [contentEl(), ctx.triggerRef()] : [void 0, void 0],
    ([el, reference]) => {
      if (!ctx.positioning || !el || !reference) return;
      const result = ctx.positioning.update(reference, el);
      return typeof result === "function" ? result : void 0;
    }
  );
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      ref: setContentEl,
      class: props.class,
      style: props.style,
      onPointerEnter: () => ctx.onContentEnter(),
      onPointerLeave: () => ctx.onContentLeave(),
      ...applySemanticAttrs({
        scope: "hover-card",
        part: "content",
        state: "open"
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