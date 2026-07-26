// src/index.tsx
import {
  Show,
  createSignal,
  createContext,
  useContext,
  onCleanup,
  onSettled
} from "solid-js";
import {
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";
var ContextMenuContext = createContext();
function useContextMenuContext() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu parts must be used within ContextMenu.Root");
  return ctx;
}
function Root(props) {
  const baseId = createStableId("context-menu");
  const [open, setOpen] = createSignal(false);
  const collection = createCollection();
  const rovingFocus = createRovingFocus();
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id);
    }
  });
  const ctx = {
    open,
    setOpen,
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`
  };
  return /* @__PURE__ */ React.createElement(ContextMenuContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useContextMenuContext();
  const handleContextMenu = (e) => {
    e.preventDefault();
    ctx.setOpen(true);
  };
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      id: ctx.triggerId,
      class: props.class,
      onContextMenu: handleContextMenu,
      ...applySemanticAttrs({
        scope: "context-menu",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useContextMenuContext();
  let contentEl;
  onSettled(() => {
    if (!contentEl) return;
    const doc = contentEl.ownerDocument;
    const stack = getLayerStack(doc);
    const removeLayer = stack.push({
      id: ctx.contentId,
      element: contentEl,
      modal: true
    });
    const removeDismissable = setupDismissableLayer({
      document: doc,
      layerId: ctx.contentId,
      element: () => contentEl,
      excludeElements: () => {
        const trigger = doc.getElementById(ctx.triggerId);
        return trigger ? [trigger] : [];
      },
      onDismiss: () => {
        ctx.setOpen(false);
      }
    });
    const items = ctx.collection.enabledItems();
    if (items.length > 0) {
      ctx.rovingFocus.setActiveId(items[0].id);
    }
    return () => {
      removeDismissable();
      removeLayer();
    };
  });
  const handleKeyDown = (e) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
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
    if (e.key === "Home") {
      e.preventDefault();
      const items = ctx.collection.enabledItems();
      if (items.length > 0) ctx.rovingFocus.setActiveId(items[0].id);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      const items = ctx.collection.enabledItems();
      if (items.length > 0) ctx.rovingFocus.setActiveId(items[items.length - 1].id);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const activeId = ctx.rovingFocus.activeId();
      if (activeId) {
        const item = ctx.collection.getItem(activeId);
        if (item && !item.disabled()) {
          item.activate?.();
          ctx.setOpen(false);
        }
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      ctx.setOpen(false);
      return;
    }
    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId());
  };
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "menu",
      tabindex: 0,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        contentEl = el;
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "context-menu",
        part: "content",
        state: "open"
      })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useContextMenuContext();
  const itemId = createStableId("context-menu-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => props.onSelect?.()
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    props.onSelect?.();
    ctx.setOpen(false);
  };
  const handlePointerMove = () => {
    if (props.disabled) return;
    ctx.rovingFocus.setActiveId(itemId);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "menuitem",
      tabindex: isHighlighted() ? 0 : -1,
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      ...applySemanticAttrs({
        scope: "context-menu",
        part: "item",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
function CheckboxItem(props) {
  const ctx = useContextMenuContext();
  const itemId = createStableId("context-menu-checkbox");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return;
      props.onCheckedChange?.(!props.checked);
    }
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    props.onCheckedChange?.(!props.checked);
  };
  const handlePointerMove = () => {
    if (props.disabled) return;
    ctx.rovingFocus.setActiveId(itemId);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "menuitemcheckbox",
      "aria-checked": props.checked ? "true" : "false",
      tabindex: isHighlighted() ? 0 : -1,
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      ...applySemanticAttrs({
        scope: "context-menu",
        part: "checkbox-item",
        state: props.checked ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
var ContextMenuRadioGroupContext = createContext();
function RadioGroup(props) {
  return /* @__PURE__ */ React.createElement(
    ContextMenuRadioGroupContext,
    {
      value: { value: props.value, onValueChange: props.onValueChange }
    },
    /* @__PURE__ */ React.createElement("div", { role: "group", ...applySemanticAttrs({ scope: "context-menu", part: "radio-group" }) }, props.children)
  );
}
function RadioItem(props) {
  const ctx = useContextMenuContext();
  const radioCtx = useContext(ContextMenuRadioGroupContext);
  const itemId = createStableId("context-menu-radio");
  const isChecked = () => radioCtx?.value === props.value;
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return;
      radioCtx?.onValueChange?.(props.value);
    }
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    radioCtx?.onValueChange?.(props.value);
  };
  const handlePointerMove = () => {
    if (props.disabled) return;
    ctx.rovingFocus.setActiveId(itemId);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "menuitemradio",
      "aria-checked": isChecked() ? "true" : "false",
      tabindex: isHighlighted() ? 0 : -1,
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      onPointerMove: handlePointerMove,
      ...applySemanticAttrs({
        scope: "context-menu",
        part: "radio-item",
        state: isChecked() ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
function Separator(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "separator",
      class: props.class,
      ...applySemanticAttrs({ scope: "context-menu", part: "separator" })
    }
  );
}
function Label(props) {
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "context-menu", part: "label" }) }, props.children);
}
export {
  CheckboxItem,
  Content,
  Item,
  Label,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Trigger
};
//# sourceMappingURL=index.js.map