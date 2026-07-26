// src/menu.tsx
import {
  Show,
  createSignal,
  createContext as createContext2,
  useContext as useContext2,
  onCleanup,
  onSettled
} from "solid-js";
import {
  createDisclosureState,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/menu-context.ts
import { createContext, useContext } from "solid-js";
var MenuContext = createContext();
function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("[solidiom] Menu parts must be used within Menu.Root");
  }
  return ctx;
}

// src/menu.tsx
function Root(props) {
  const baseId = createStableId("menu");
  const [triggerRef, setTriggerRef] = createSignal(void 0);
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const collection = createCollection();
  const rovingFocus = createRovingFocus();
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id);
    }
  });
  const activateItem = (itemId) => {
    const item = collection.getItem(itemId);
    if (!item || item.disabled()) return;
    item.activate?.();
    requestOpenChange(false, createChangeDetails("trigger"));
  };
  const ctx = {
    open,
    requestOpenChange,
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    activateItem,
    triggerRef,
    setTriggerRef
  };
  return /* @__PURE__ */ React.createElement(MenuContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useMenuContext();
  const handleClick = () => {
    if (props.contextMenu) return;
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"));
  };
  const handleContextMenu = (e) => {
    if (!props.contextMenu) return;
    e.preventDefault();
    ctx.requestOpenChange(true, createChangeDetails("trigger"));
  };
  const handleKeyDown = (e) => {
    if (props.contextMenu) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
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
      "aria-haspopup": "menu",
      "aria-expanded": ctx.open() ? "true" : void 0,
      "aria-controls": ctx.open() ? ctx.contentId : void 0,
      onClick: handleClick,
      onContextMenu: handleContextMenu,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        ctx.setTriggerRef(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "menu",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useMenuContext();
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
      onDismiss: (reason) => {
        ctx.requestOpenChange(false, createChangeDetails(reason));
      }
    });
    const deactivateFocus = activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => ctx.triggerRef()
    });
    const items = ctx.collection.enabledItems();
    if (items.length > 0) {
      ctx.rovingFocus.setActiveId(items[0].id);
    }
    return () => {
      deactivateFocus();
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
      if (activeId) ctx.activateItem(activeId);
      return;
    }
    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId());
  };
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "menu",
      "aria-labelledby": ctx.triggerId,
      tabindex: 0,
      onKeyDown: handleKeyDown,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "menu",
        part: "content",
        state: "open"
      })
    },
    props.children
  ));
}
function Item(props) {
  const ctx = useMenuContext();
  const itemId = createStableId("menu-item");
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
    ctx.requestOpenChange(false, createChangeDetails("trigger"));
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
        scope: "menu",
        part: "item",
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
      ...applySemanticAttrs({ scope: "menu", part: "separator" })
    }
  );
}
function CheckboxItem(props) {
  const ctx = useMenuContext();
  const itemId = createStableId("menu-checkbox");
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
        scope: "menu",
        part: "checkbox-item",
        state: props.checked ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
var MenuRadioGroupContext = createContext2();
function RadioGroup(props) {
  return /* @__PURE__ */ React.createElement(MenuRadioGroupContext, { value: { value: props.value, onValueChange: props.onValueChange } }, /* @__PURE__ */ React.createElement("div", { role: "group", ...applySemanticAttrs({ scope: "menu", part: "radio-group" }) }, props.children));
}
function RadioItem(props) {
  const ctx = useMenuContext();
  const radioCtx = useContext2(MenuRadioGroupContext);
  const itemId = createStableId("menu-radio");
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
        scope: "menu",
        part: "radio-item",
        state: isChecked() ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
function Label(props) {
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "menu", part: "label" }) }, props.children);
}
var MenuSubContext = createContext2();
function Sub(props) {
  const [open, setOpen] = createSignal(false);
  const subContentId = createStableId("menu-sub-content");
  const subTriggerId = createStableId("menu-sub-trigger");
  return /* @__PURE__ */ React.createElement(MenuSubContext, { value: { open, setOpen, subContentId, subTriggerId } }, props.children);
}
function SubTrigger(props) {
  const ctx = useMenuContext();
  const subCtx = useContext2(MenuSubContext);
  const itemId = createStableId("menu-sub-trigger-item");
  const item = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return;
      subCtx?.setOpen(true);
    }
  };
  const cleanup = ctx.collection.registerItem(item);
  onCleanup(cleanup);
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId;
  const handlePointerEnter = () => {
    if (props.disabled) return;
    ctx.rovingFocus.setActiveId(itemId);
    subCtx?.setOpen(true);
  };
  const handlePointerLeave = () => {
    subCtx?.setOpen(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      subCtx?.setOpen(true);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: subCtx?.subTriggerId ?? itemId,
      role: "menuitem",
      "aria-haspopup": "menu",
      "aria-expanded": subCtx?.open() ? "true" : void 0,
      "aria-controls": subCtx?.open() ? subCtx.subContentId : void 0,
      tabindex: isHighlighted() ? 0 : -1,
      "aria-disabled": props.disabled ? "true" : void 0,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onKeyDown: handleKeyDown,
      ...applySemanticAttrs({
        scope: "menu",
        part: "sub-trigger",
        state: subCtx?.open() ? "open" : "closed",
        disabled: props.disabled,
        highlighted: isHighlighted()
      })
    },
    props.children
  );
}
function SubContent(props) {
  const subCtx = useContext2(MenuSubContext);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      subCtx?.setOpen(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Show, { when: subCtx?.open() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: subCtx?.subContentId,
      role: "menu",
      onKeyDown: handleKeyDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "menu",
        part: "sub-content",
        state: "open"
      })
    },
    props.children
  ));
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
  Sub,
  SubContent,
  SubTrigger,
  Trigger
};
//# sourceMappingURL=index.js.map