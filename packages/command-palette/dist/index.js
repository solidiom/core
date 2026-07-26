// src/command-palette.tsx
import { Show, createSignal, onCleanup, onSettled } from "solid-js";
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createStableId,
  createPresence,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/command-palette-context.ts
import { createContext, useContext } from "solid-js";
var CommandPaletteContext = createContext();
function useCommandPaletteContext() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("[solidiom] CommandPalette parts must be used within CommandPalette.Root");
  }
  return ctx;
}

// src/command-palette.tsx
function Root(props) {
  const baseId = createStableId("cmd-palette");
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
  const [highlightedId, setHighlightedId] = createSignal(null);
  const collection = createCollection();
  const presence = createPresence({ open });
  const setInputValue = (next) => {
    requestInputChange(next, createChangeDetails("input"));
  };
  const ctx = {
    open,
    requestOpenChange,
    inputValue,
    setInputValue,
    highlightedId,
    setHighlightedId,
    collection,
    inputId: `${baseId}-input`,
    listId: `${baseId}-list`,
    contentId: `${baseId}-content`
  };
  let contentEl;
  onSettled(() => {
    if (!contentEl || !open()) return;
    const doc = contentEl.ownerDocument;
    const stack = getLayerStack(doc);
    const removeLayer = stack.push({ id: ctx.contentId, element: contentEl, modal: true });
    const removeDismissable = setupDismissableLayer({
      document: doc,
      layerId: ctx.contentId,
      element: () => contentEl,
      onDismiss: (reason) => {
        requestOpenChange(false, createChangeDetails(reason));
      }
    });
    const deactivateFocus = activateFocusScope({
      element: () => contentEl
    });
    return () => {
      deactivateFocus();
      removeDismissable();
      removeLayer();
    };
  });
  return /* @__PURE__ */ React.createElement(CommandPaletteContext, { value: ctx }, /* @__PURE__ */ React.createElement(Show, { when: presence.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Command palette",
      id: ctx.contentId,
      class: props.class,
      style: props.style,
      ref: (el) => {
        contentEl = el;
      },
      ...applySemanticAttrs({
        scope: "command-palette",
        part: "root",
        state: open() ? "open" : "closed"
      })
    },
    props.children
  )));
}
function Input(props) {
  const ctx = useCommandPaletteContext();
  const handleInput = (e) => {
    const target = e.target;
    ctx.setInputValue(target.value);
    props.onFilter?.(target.value);
    ctx.setHighlightedId(null);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      ctx.requestOpenChange(false, createChangeDetails("escape"));
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
        const el = document.getElementById(activeId);
        el?.click();
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
      "aria-expanded": "true",
      "aria-controls": ctx.listId,
      "aria-activedescendant": ctx.highlightedId() ?? void 0,
      value: ctx.inputValue(),
      placeholder: props.placeholder,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      ref: props.ref,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "command-palette", part: "input" })
    }
  );
}
function List(props) {
  const ctx = useCommandPaletteContext();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.listId,
      role: "listbox",
      ref: props.ref,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "command-palette", part: "list" })
    },
    props.children
  );
}
function Group(props) {
  const groupId = createStableId("cmd-group");
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      "aria-labelledby": props.heading ? `${groupId}-heading` : void 0,
      class: props.class,
      ...applySemanticAttrs({ scope: "command-palette", part: "group" })
    },
    props.heading && /* @__PURE__ */ React.createElement(
      "div",
      {
        id: `${groupId}-heading`,
        "aria-hidden": "true",
        ...applySemanticAttrs({ scope: "command-palette", part: "group-heading" })
      },
      props.heading
    ),
    props.children
  );
}
function Item(props) {
  const ctx = useCommandPaletteContext();
  const itemId = createStableId("cmd-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isHighlighted = () => ctx.highlightedId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    props.onSelect?.();
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
      "aria-disabled": props.disabled ? "true" : void 0,
      "aria-selected": isHighlighted() ? "true" : "false",
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      class: props.class,
      ...applySemanticAttrs({
        scope: "command-palette",
        part: "item",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
function Empty(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "presentation",
      class: props.class,
      ...applySemanticAttrs({ scope: "command-palette", part: "empty" })
    },
    props.children
  );
}
export {
  Empty,
  Group,
  Input,
  Item,
  List,
  Root
};
//# sourceMappingURL=index.js.map