// src/combobox.tsx
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/combobox-context.ts
import { createContext, useContext } from "solid-js";
var ComboboxContext = createContext();
function useComboboxContext() {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error("[solidiom] Combobox parts must be used within Combobox.Root");
  }
  return ctx;
}

// src/combobox.tsx
function Root(props) {
  const baseId = createStableId("combobox");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const { value: inputValue, requestChange: requestInputChange } = createControllableValue({
    value: props.inputValue,
    defaultValue: props.defaultInputValue ?? "",
    onChange: (v) => props.onInputValueChange?.(v)
  });
  const { value: selectedValue, requestChange: requestSelectedChange } = createControllableValue({
    value: props.selectedValue,
    defaultValue: props.defaultSelectedValue ?? "",
    onChange: props.onSelectedValueChange
  });
  const [highlightedId, setHighlightedId] = createSignal(null);
  const collection = createCollection();
  const setInputValue = (next) => {
    requestInputChange(next, createChangeDetails("input"));
  };
  const ctx = {
    open,
    requestOpenChange,
    inputValue,
    setInputValue,
    selectedValue,
    requestSelectedChange,
    highlightedId,
    setHighlightedId,
    collection,
    inputId: `${baseId}-input`,
    listboxId: `${baseId}-listbox`,
    labelId: `${baseId}-label`
  };
  return /* @__PURE__ */ React.createElement(ComboboxContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "combobox",
        part: "root",
        state: open() ? "open" : "closed"
      })
    },
    props.children
  ));
}
function Input(props) {
  const ctx = useComboboxContext();
  const handleInput = (e) => {
    const target = e.target;
    ctx.setInputValue(target.value);
    props.onFilter?.(target.value);
    if (!ctx.open()) {
      ctx.requestOpenChange(true, createChangeDetails("trigger"));
    }
  };
  const handleFocus = () => {
    if (!ctx.open()) {
      ctx.requestOpenChange(true, createChangeDetails("trigger"));
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      ctx.requestOpenChange(false, createChangeDetails("escape"));
      return;
    }
    if (!ctx.open()) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        ctx.requestOpenChange(true, createChangeDetails("trigger"));
      }
      return;
    }
    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
      direction: "ltr"
    });
    if (intent) {
      e.preventDefault();
      const items = ctx.collection.enabledItems();
      const next = resolveNextItem(items, ctx.highlightedId() ?? void 0, intent, { loop: true });
      if (next) ctx.setHighlightedId(next.id);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const activeId = ctx.highlightedId();
      if (activeId) {
        const item = ctx.collection.getItem(activeId);
        if (item) {
          ctx.requestSelectedChange(item.textValue(), createChangeDetails("keyboard"));
          ctx.setInputValue(item.textValue());
          ctx.requestOpenChange(false, createChangeDetails("trigger"));
        }
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      id: ctx.inputId,
      type: "text",
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-expanded": ctx.open() ? "true" : "false",
      "aria-controls": ctx.listboxId,
      "aria-activedescendant": ctx.highlightedId() ?? void 0,
      value: ctx.inputValue(),
      placeholder: props.placeholder,
      onInput: handleInput,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      ref: props.ref,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "combobox", part: "input" })
    }
  );
}
function Content(props) {
  const ctx = useComboboxContext();
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
          const input = doc.getElementById(ctx.inputId);
          return input ? [input] : [];
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
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.listboxId,
      role: "listbox",
      ref: (el) => {
        setContentEl(el);
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "combobox", part: "content", state: "open" })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useComboboxContext();
  const itemId = createStableId("combobox-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isSelected = () => ctx.selectedValue() === props.value;
  const isHighlighted = () => ctx.highlightedId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    const text = props.textValue ?? props.value;
    ctx.requestSelectedChange(text, createChangeDetails("item-click"));
    ctx.setInputValue(text);
    ctx.requestOpenChange(false, createChangeDetails("trigger"));
  };
  const handlePointerMove = () => {
    if (props.disabled) return;
    ctx.setHighlightedId(itemId);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "option",
      "aria-selected": isSelected() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      ...applySemanticAttrs({
        scope: "combobox",
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
function ItemText(props) {
  return /* @__PURE__ */ React.createElement("span", { ...applySemanticAttrs({ scope: "combobox", part: "item-text" }) }, props.children);
}
export {
  Content,
  Input,
  Item,
  ItemText,
  Root
};
//# sourceMappingURL=index.js.map