// src/accordion.tsx
import { onCleanup, Show } from "solid-js";
import {
  createControllableValue,
  createCollection,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/accordion-context.ts
import { createContext, useContext } from "solid-js";
var AccordionContext = createContext();
var AccordionItemContext = createContext();
function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("[solidiom] Accordion parts must be used within Accordion.Root");
  }
  return ctx;
}
function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error("[solidiom] Accordion.Trigger/Content must be used within Accordion.Item");
  }
  return ctx;
}

// src/accordion.tsx
function Root(props) {
  const multiple = (props.type ?? "single") === "multiple";
  const collapsible = props.collapsible ?? false;
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onValueChange,
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  });
  const collection = createCollection({ orientation: () => "vertical" });
  const requestValueChange = (next, details) => {
    requestChange(next, details);
  };
  const ctx = {
    value,
    requestValueChange,
    multiple,
    disabled: props.disabled ?? (() => false),
    collection,
    collapsible
  };
  return /* @__PURE__ */ React.createElement(AccordionContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "accordion",
        part: "root"
      })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useAccordionContext();
  const baseId = createStableId("accordion-item");
  const isExpanded = () => ctx.value().includes(props.value);
  const isDisabled = () => props.disabled ?? ctx.disabled();
  const itemCtx = {
    value: props.value,
    disabled: isDisabled,
    isExpanded,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`
  };
  return /* @__PURE__ */ React.createElement(AccordionItemContext, { value: itemCtx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "accordion",
        part: "item",
        state: isExpanded() ? "open" : "closed",
        disabled: isDisabled()
      })
    },
    props.children
  ));
}
function Trigger(props) {
  const ctx = useAccordionContext();
  const itemCtx = useAccordionItemContext();
  const itemId = createStableId("accordion-trigger-item");
  const collectionItem = {
    id: itemId,
    disabled: itemCtx.disabled,
    textValue: () => itemCtx.value
  };
  const cleanup = ctx.collection.registerItem(collectionItem);
  onCleanup(cleanup);
  const toggle = () => {
    if (itemCtx.disabled()) return;
    const current = ctx.value();
    const expanded = current.includes(itemCtx.value);
    if (expanded) {
      if (!ctx.multiple && !ctx.collapsible) return;
      const next = current.filter((v) => v !== itemCtx.value);
      ctx.requestValueChange(next, createChangeDetails("trigger-click"));
    } else {
      const next = ctx.multiple ? [...current, itemCtx.value] : [itemCtx.value];
      ctx.requestValueChange(next, createChangeDetails("trigger-click"));
    }
  };
  const handleClick = () => {
    toggle();
  };
  const handleKeyDown = (e) => {
    if (itemCtx.disabled()) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
      return;
    }
    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
      direction: "ltr"
    });
    if (intent) {
      e.preventDefault();
      const next = resolveNextItem(ctx.collection.enabledItems(), itemId, intent, { loop: true });
      if (next?.ref) {
        ;
        next.ref.focus();
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: itemCtx.triggerId,
      "aria-expanded": itemCtx.isExpanded() ? "true" : "false",
      "aria-controls": itemCtx.contentId,
      disabled: itemCtx.disabled(),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        collectionItem.ref = el;
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "accordion",
        part: "trigger",
        state: itemCtx.isExpanded() ? "open" : "closed",
        disabled: itemCtx.disabled()
      })
    },
    props.children
  );
}
function Content(props) {
  const itemCtx = useAccordionItemContext();
  return /* @__PURE__ */ React.createElement(Show, { when: itemCtx.isExpanded() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemCtx.contentId,
      role: "region",
      "aria-labelledby": itemCtx.triggerId,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "accordion",
        part: "content",
        state: "open"
      })
    },
    props.children
  ));
}
export {
  Content,
  Item,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map