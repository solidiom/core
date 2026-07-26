// src/index.tsx
import { createContext, useContext, Show } from "solid-js";
import { createDisclosureState, createStableId, applySemanticAttrs } from "@solidiom/runtime";
var CollapsibleContext = createContext();
function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error("Collapsible parts must be used within Root");
  return ctx;
}
function Root(props) {
  const baseId = createStableId("collapsible");
  const disabled = () => props.disabled ?? false;
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: (v, _d) => props.onOpenChange?.(v),
    disabled
  });
  const toggle = () => {
    if (disabled()) return;
    requestOpenChange(!open(), { reason: "trigger" });
  };
  const ctx = {
    open,
    toggle,
    disabled,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`
  };
  return /* @__PURE__ */ React.createElement(CollapsibleContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "collapsible",
        part: "root",
        state: open() ? "open" : "closed",
        disabled: props.disabled
      })
    },
    props.children
  ));
}
function Trigger(props) {
  const ctx = useCollapsibleContext();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: ctx.triggerId,
      "aria-expanded": ctx.open() ? "true" : "false",
      "aria-controls": ctx.contentId,
      "aria-disabled": ctx.disabled() ? "true" : void 0,
      onClick: () => ctx.toggle(),
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "collapsible",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
        disabled: ctx.disabled()
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useCollapsibleContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "region",
      "aria-labelledby": ctx.triggerId,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "collapsible", part: "content", state: "open" })
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