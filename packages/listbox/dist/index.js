// src/listbox.tsx
import { onCleanup } from "solid-js";
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/listbox-context.ts
import { createContext, useContext } from "solid-js";
var ListboxContext = createContext();
function useListboxContext() {
  const ctx = useContext(ListboxContext);
  if (!ctx) {
    throw new Error("[solidiom] Listbox parts must be used within Listbox.Root");
  }
  return ctx;
}

// src/listbox.tsx
function Root(props) {
  const selectionMode = props.selectionMode ?? "single";
  const orientation = props.orientation ?? "vertical";
  const loop = props.loop ?? true;
  const baseId = createStableId("listbox");
  const { value, requestChange: requestValueChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onValueChange
  });
  const collection = createCollection();
  const rovingFocus = createRovingFocus();
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id);
    }
  });
  const ctx = {
    value,
    requestValueChange,
    selectionMode,
    collection,
    rovingFocus,
    typeahead,
    listboxId: `${baseId}-list`,
    disabled: props.disabled ?? (() => false)
  };
  const handleKeyDown = (e) => {
    if (ctx.disabled()) return;
    const intent = resolveNavigationIntent(e.key, {
      orientation,
      direction: collection.direction()
    });
    if (intent) {
      e.preventDefault();
      const next = resolveNextItem(collection.enabledItems(), rovingFocus.activeId(), intent, {
        loop
      });
      if (next) rovingFocus.setActiveId(next.id);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      const items = collection.enabledItems();
      if (items.length > 0) rovingFocus.setActiveId(items[0].id);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      const items = collection.enabledItems();
      if (items.length > 0) rovingFocus.setActiveId(items[items.length - 1].id);
      return;
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const activeId = rovingFocus.activeId();
      if (activeId) selectItem(ctx, activeId);
      return;
    }
    typeahead.handle(e.key, collection.items(), rovingFocus.activeId());
  };
  return /* @__PURE__ */ React.createElement(ListboxContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.listboxId,
      role: "listbox",
      "aria-label": props["aria-label"],
      "aria-multiselectable": selectionMode === "multiple" ? "true" : void 0,
      "aria-disabled": ctx.disabled() ? "true" : void 0,
      "aria-orientation": orientation,
      tabindex: ctx.disabled() ? void 0 : 0,
      onKeyDown: handleKeyDown,
      ref: props.ref,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "listbox",
        part: "root",
        disabled: ctx.disabled()
      })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useListboxContext();
  const itemId = createStableId("listbox-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isSelected = () => ctx.value().includes(props.value);
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handleClick = () => {
    if (props.disabled || ctx.disabled()) return;
    selectItem(ctx, itemId);
  };
  const handlePointerMove = () => {
    if (props.disabled || ctx.disabled()) return;
    ctx.rovingFocus.setActiveId(itemId);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "option",
      "aria-selected": isSelected() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      tabindex: isHighlighted() ? 0 : -1,
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      ...applySemanticAttrs({
        scope: "listbox",
        part: "item",
        state: isSelected() ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted(),
        selected: isSelected()
      })
    },
    props.children
  );
}
function selectItem(ctx, itemId) {
  const item = ctx.collection.getItem(itemId);
  if (!item) return;
  const itemValue = item.textValue();
  if (ctx.selectionMode === "multiple") {
    const current = ctx.value();
    const next = current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue];
    ctx.requestValueChange(next, createChangeDetails("item-click"));
  } else {
    ctx.requestValueChange([itemValue], createChangeDetails("item-click"));
  }
}
export {
  Item,
  Root
};
//# sourceMappingURL=index.js.map