// src/index.tsx
import { createSignal, onCleanup } from "solid-js";
import { Show } from "@solidjs/web";
import {
  createCollection,
  createRovingFocus,
  createPointerIntent,
  createStableId,
  createPresence,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem
} from "@solidiom/runtime";

// src/navigation-menu-context.ts
import { createContext, useContext } from "solid-js";
var NavigationMenuContext = createContext();
function useNavigationMenuContext() {
  const ctx = useContext(NavigationMenuContext);
  if (!ctx) {
    throw new Error("[solidiom] NavigationMenu parts must be used within NavigationMenu.Root");
  }
  return ctx;
}
var NavigationMenuItemContext = createContext();
function useNavigationMenuItemContext() {
  const ctx = useContext(NavigationMenuItemContext);
  if (!ctx) {
    throw new Error(
      "[solidiom] NavigationMenu.Trigger/Content must be used within NavigationMenu.Item"
    );
  }
  return ctx;
}

// src/index.tsx
function Root(props) {
  const orientation = () => props.orientation ?? "horizontal";
  const delayDuration = props.delayDuration ?? 200;
  const [activeValue, setActiveValueRaw] = createSignal(props.defaultValue ?? "");
  const setActiveValue = (value2) => {
    setActiveValueRaw(value2);
    props.onValueChange?.(value2);
  };
  const close = () => {
    setActiveValueRaw("");
    props.onValueChange?.("");
  };
  const collection = createCollection({
    orientation: () => orientation() === "horizontal" ? "horizontal" : "vertical"
  });
  const rovingFocus = createRovingFocus();
  const pointerIntent = createPointerIntent({
    delay: delayDuration,
    onIntentConfirm: () => {
    },
    onIntentCancel: () => {
      close();
    }
  });
  const value = () => {
    if (props.value !== void 0) {
      return props.value() ?? "";
    }
    return activeValue();
  };
  return /* @__PURE__ */ React.createElement(
    NavigationMenuContext,
    {
      value: {
        activeValue: value,
        setActiveValue,
        close,
        collection,
        rovingFocus,
        pointerIntent,
        orientation,
        positioning: props.positioning,
        delayDuration
      }
    },
    /* @__PURE__ */ React.createElement(
      "nav",
      {
        "aria-label": props["aria-label"] ?? "Main",
        class: props.class,
        style: props.style,
        ...applySemanticAttrs({
          scope: "navigation-menu",
          part: "root",
          orientation: orientation()
        })
      },
      props.children
    )
  );
}
function List(props) {
  const ctx = useNavigationMenuContext();
  const handleKeyDown = (e) => {
    const items = ctx.collection.enabledItems();
    const activeId = ctx.rovingFocus.activeId();
    if (!items.length) return;
    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.orientation(),
      direction: "ltr",
      loop: true
    });
    if (!intent) return;
    e.preventDefault();
    const nextItem = resolveNextItem(items, activeId, intent, { loop: true });
    if (nextItem) {
      ctx.rovingFocus.setActiveId(nextItem.id);
      nextItem.ref?.focus();
    }
  };
  return /* @__PURE__ */ React.createElement(
    "ul",
    {
      role: "menubar",
      "aria-orientation": ctx.orientation(),
      onKeyDown: handleKeyDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "navigation-menu",
        part: "list",
        orientation: ctx.orientation()
      })
    },
    props.children
  );
}
function Item(props) {
  const ctx = useNavigationMenuContext();
  const triggerId = createStableId("nav-trigger");
  const contentId = createStableId("nav-content");
  const isOpen = () => ctx.activeValue() === props.value;
  return /* @__PURE__ */ React.createElement(
    NavigationMenuItemContext,
    {
      value: {
        value: props.value,
        isOpen,
        triggerId,
        contentId
      }
    },
    /* @__PURE__ */ React.createElement(
      "li",
      {
        role: "none",
        class: props.class,
        style: props.style,
        ...applySemanticAttrs({
          scope: "navigation-menu",
          part: "item"
        })
      },
      props.children
    )
  );
}
function Trigger(props) {
  const ctx = useNavigationMenuContext();
  const itemCtx = useNavigationMenuItemContext();
  let ref;
  const itemId = itemCtx.value;
  const unregister = ctx.collection.registerItem({
    id: itemId,
    get ref() {
      return ref;
    },
    disabled: () => false,
    textValue: () => itemId
  });
  onCleanup(unregister);
  const handleClick = () => {
    if (itemCtx.isOpen()) {
      ctx.close();
    } else {
      ctx.setActiveValue(itemCtx.value);
    }
  };
  const handlePointerEnter = () => {
    ctx.pointerIntent.handleTriggerEnter();
    ctx.setActiveValue(itemCtx.value);
  };
  const handlePointerLeave = () => {
    ctx.pointerIntent.handleTriggerLeave();
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ctx.setActiveValue(itemCtx.value);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref,
      id: itemCtx.triggerId,
      type: "button",
      role: "menuitem",
      "aria-expanded": itemCtx.isOpen() ? "true" : void 0,
      "aria-controls": itemCtx.contentId,
      "aria-haspopup": "menu",
      tabindex: ctx.rovingFocus.getTabIndex(itemId),
      onClick: handleClick,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onKeyDown: handleKeyDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "navigation-menu",
        part: "trigger",
        state: itemCtx.isOpen() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useNavigationMenuContext();
  const itemCtx = useNavigationMenuItemContext();
  const presence = createPresence({ open: itemCtx.isOpen });
  const handlePointerEnter = () => {
    ctx.pointerIntent.handleContentEnter();
  };
  const handlePointerLeave = () => {
    ctx.pointerIntent.handleContentLeave();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      ctx.close();
      const triggerEl = document.getElementById(itemCtx.triggerId);
      triggerEl?.focus();
    }
  };
  return /* @__PURE__ */ React.createElement(Show, { when: presence.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemCtx.contentId,
      role: "menu",
      "aria-labelledby": itemCtx.triggerId,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onKeyDown: handleKeyDown,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "navigation-menu",
        part: "content",
        state: itemCtx.isOpen() ? "open" : "closed"
      })
    },
    props.children
  ));
}
function Link(props) {
  const ctx = useNavigationMenuContext();
  const handleClick = (e) => {
    props.onClick?.(e);
    ctx.close();
  };
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      role: "menuitem",
      href: props.href,
      "aria-current": props.active ? "page" : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "navigation-menu",
        part: "link",
        ...props.active ? { state: "active" } : {}
      })
    },
    props.children
  );
}
export {
  Content,
  Item,
  Link,
  List,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map