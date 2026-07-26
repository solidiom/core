// src/tabs.tsx
import { onCleanup, Show } from "solid-js";
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/tabs-context.ts
import { createContext, useContext } from "solid-js";
var TabsContext = createContext();
function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("[solidiom] Tabs parts must be used within Tabs.Root");
  }
  return ctx;
}

// src/tabs.tsx
function Root(props) {
  const orientation = props.orientation ?? "horizontal";
  const activationMode = props.activationMode ?? "automatic";
  const baseId = createStableId("tabs");
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: props.onValueChange
  });
  const collection = createCollection({
    orientation: () => orientation === "horizontal" ? "horizontal" : "vertical"
  });
  const rovingFocus = createRovingFocus();
  const ctx = {
    value,
    requestValueChange: requestChange,
    orientation: () => orientation,
    activationMode,
    collection,
    rovingFocus,
    baseId
  };
  return /* @__PURE__ */ React.createElement(TabsContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "tabs",
        part: "root",
        orientation
      })
    },
    props.children
  ));
}
function List(props) {
  const ctx = useTabsContext();
  const handleKeyDown = (e) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.orientation(),
      direction: ctx.collection.direction()
    });
    if (intent) {
      e.preventDefault();
      const next = resolveNextItem(
        ctx.collection.enabledItems(),
        ctx.rovingFocus.activeId(),
        intent,
        { loop: true }
      );
      if (next) {
        ctx.rovingFocus.setActiveId(next.id);
        if (next.ref) {
          ;
          next.ref.focus();
        }
        if (ctx.activationMode === "automatic") {
          ctx.requestValueChange(next.textValue(), createChangeDetails("keyboard"));
        }
      }
      return;
    }
    if (ctx.activationMode === "manual" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const activeId = ctx.rovingFocus.activeId();
      if (activeId) {
        const item = ctx.collection.getItem(activeId);
        if (item) {
          ctx.requestValueChange(item.textValue(), createChangeDetails("keyboard"));
        }
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "tablist",
      "aria-orientation": ctx.orientation(),
      onKeyDown: handleKeyDown,
      class: props.class,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "tabs",
        part: "list",
        orientation: ctx.orientation()
      })
    },
    props.children
  );
}
function Trigger(props) {
  const ctx = useTabsContext();
  const itemId = createStableId("tabs-trigger");
  const collectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.value
  };
  const cleanup = ctx.collection.registerItem(collectionItem);
  onCleanup(cleanup);
  const isSelected = () => ctx.value() === props.value;
  const panelId = () => `${ctx.baseId}-content-${props.value}`;
  const handleClick = () => {
    if (props.disabled) return;
    ctx.rovingFocus.setActiveId(itemId, false);
    ctx.requestValueChange(props.value, createChangeDetails("trigger-click"));
  };
  const handleFocus = () => {
    ctx.rovingFocus.setActiveId(itemId, false);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: `${ctx.baseId}-trigger-${props.value}`,
      role: "tab",
      "aria-selected": isSelected() ? "true" : "false",
      "aria-controls": panelId(),
      disabled: props.disabled,
      tabindex: ctx.rovingFocus.getTabIndex(itemId),
      onClick: handleClick,
      onFocus: handleFocus,
      ref: (el) => {
        collectionItem.ref = el;
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "tabs",
        part: "trigger",
        state: isSelected() ? "active" : "inactive",
        disabled: props.disabled
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useTabsContext();
  const isSelected = () => ctx.value() === props.value;
  const triggerId = () => `${ctx.baseId}-trigger-${props.value}`;
  return /* @__PURE__ */ React.createElement(Show, { when: isSelected() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: `${ctx.baseId}-content-${props.value}`,
      role: "tabpanel",
      "aria-labelledby": triggerId(),
      tabindex: 0,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "tabs",
        part: "content",
        state: "active"
      })
    },
    props.children
  ));
}
export {
  Content,
  List,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map