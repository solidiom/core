// src/select.tsx
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  getHiddenInputProps,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/select-context.ts
import { createContext, useContext } from "solid-js";
var SelectContext = createContext();
function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error("[solidiom] Select parts must be used within Select.Root");
  }
  return ctx;
}

// src/select.tsx
function Root(props) {
  const multiple = props.multiple ?? false;
  const baseId = createStableId("select");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    disabled: props.disabled
  });
  const { value, requestChange: requestValueChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? (multiple ? [] : ""),
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
    open,
    requestOpenChange,
    value,
    requestValueChange,
    multiple,
    disabled: props.disabled ?? (() => false),
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    listboxId: `${baseId}-listbox`,
    labelId: `${baseId}-label`,
    name: props.name
  };
  return /* @__PURE__ */ React.createElement(SelectContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useSelectContext();
  const handleClick = () => {
    if (ctx.disabled()) return;
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"));
  };
  const handleKeyDown = (e) => {
    if (ctx.disabled()) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!ctx.open()) {
        ctx.requestOpenChange(true, createChangeDetails("trigger"));
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: ctx.triggerId,
      role: "combobox",
      "aria-expanded": ctx.open() ? "true" : "false",
      "aria-haspopup": "listbox",
      "aria-controls": ctx.listboxId,
      "aria-label": props["aria-label"],
      "aria-labelledby": props["aria-labelledby"],
      disabled: ctx.disabled(),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "select",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
        disabled: ctx.disabled()
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useSelectContext();
  const [contentEl, setContentEl] = createSignal(void 0);
  createEffect(
    () => ctx.open() ? contentEl() : void 0,
    (el) => {
      if (!el) return;
      const doc = el.ownerDocument;
      const stack = getLayerStack(doc);
      const removeLayer = stack.push({ id: ctx.listboxId, element: el, modal: false });
      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.listboxId,
        element: () => el,
        excludeElements: () => {
          const trigger = doc.getElementById(ctx.triggerId);
          return trigger ? [trigger] : [];
        },
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason));
        }
      });
      return () => {
        removeDismissable();
        removeLayer();
      };
    }
  );
  const handleKeyDown = (e) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.collection.orientation(),
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
      if (next) ctx.rovingFocus.setActiveId(next.id);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const activeId = ctx.rovingFocus.activeId();
      if (activeId) selectItem(ctx, activeId);
      if (!ctx.multiple) {
        ctx.requestOpenChange(false, createChangeDetails("trigger"));
      }
      return;
    }
    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId());
  };
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.listboxId,
      role: "listbox",
      "aria-multiselectable": ctx.multiple ? "true" : void 0,
      "aria-labelledby": ctx.triggerId,
      tabindex: 0,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        setContentEl(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "select",
        part: "content",
        state: "open"
      })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useSelectContext();
  const itemId = createStableId("select-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isSelected = () => {
    const v = ctx.value();
    if (Array.isArray(v)) return v.includes(props.value);
    return v === props.value;
  };
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    selectItem(ctx, itemId);
    if (!ctx.multiple) {
      ctx.requestOpenChange(false, createChangeDetails("trigger"));
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "option",
      "aria-selected": isSelected() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      ...applySemanticAttrs({
        scope: "select",
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
function Value(props) {
  const ctx = useSelectContext();
  const displayValue = () => {
    const v = ctx.value();
    if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : props.placeholder ?? "";
    return v || (props.placeholder ?? "");
  };
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      ...applySemanticAttrs({
        scope: "select",
        part: "value",
        placeholder: !ctx.value() || Array.isArray(ctx.value()) && ctx.value().length === 0
      })
    },
    displayValue()
  );
}
function HiddenInput() {
  const ctx = useSelectContext();
  if (!ctx.name) return null;
  const inputProps = () => getHiddenInputProps({
    name: ctx.name,
    value: () => {
      const v = ctx.value();
      return Array.isArray(v) ? v : [v];
    },
    disabled: ctx.disabled
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, inputProps().map((p) => /* @__PURE__ */ React.createElement("input", { ...p })));
}
function selectItem(ctx, itemId) {
  const item = ctx.collection.getItem(itemId);
  if (!item) return;
  const itemValue = item.textValue();
  if (ctx.multiple) {
    const current = ctx.value();
    const next = current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue];
    ctx.requestValueChange(next, createChangeDetails("item-click"));
  } else {
    ctx.requestValueChange(itemValue, createChangeDetails("item-click"));
  }
}
function ScrollUpButton(props) {
  const handlePointerDown = (e) => {
    const listbox = e.currentTarget.parentElement;
    if (!listbox) return;
    listbox.scrollBy({ top: -50, behavior: "smooth" });
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": "true",
      onPointerDown: handlePointerDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "select", part: "scroll-up-button" })
    },
    props.children ?? "\u25B2"
  );
}
function ScrollDownButton(props) {
  const handlePointerDown = (e) => {
    const listbox = e.currentTarget.parentElement;
    if (!listbox) return;
    listbox.scrollBy({ top: 50, behavior: "smooth" });
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": "true",
      onPointerDown: handlePointerDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "select", part: "scroll-down-button" })
    },
    props.children ?? "\u25BC"
  );
}
export {
  Content,
  HiddenInput,
  Item,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value
};
//# sourceMappingURL=index.js.map