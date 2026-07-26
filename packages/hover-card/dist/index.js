// src/index.tsx
import { Show, createSignal, onCleanup, createContext, useContext } from "solid-js";
import { applySemanticAttrs, createStableId } from "@solidiom/runtime";
var HoverCardContext = createContext();
function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard parts must be used within HoverCard.Root");
  return ctx;
}
function Root(props) {
  const openDelay = () => props.openDelay ?? 700;
  const closeDelay = () => props.closeDelay ?? 300;
  const [open, setOpen] = createSignal(false);
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
    triggerId
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
  if (props.href !== void 0) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        id: ctx.triggerId,
        href: props.href,
        class: props.class,
        onPointerEnter: () => ctx.onTriggerEnter(),
        onPointerLeave: () => ctx.onTriggerLeave(),
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
      onPointerEnter: () => ctx.onTriggerEnter(),
      onPointerLeave: () => ctx.onTriggerLeave(),
      ...attrs()
    },
    props.children
  );
}
function Content(props) {
  const ctx = useHoverCardContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
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