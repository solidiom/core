// src/popover.tsx
import { createSignal, onSettled, Show } from "solid-js";
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  createChangeDetails
} from "@solidiom/runtime";

// src/popover-context.ts
import { createContext, useContext } from "solid-js";
var PopoverContext = createContext();
function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error("[solidiom] Popover parts must be used within Popover.Root");
  }
  return ctx;
}

// src/popover.tsx
function Root(props) {
  const modal = props.modal ?? false;
  const baseId = createStableId("popover");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const presence = createPresence({ open });
  const [anchorRef, setAnchorRef] = createSignal(void 0);
  const [triggerRef, setTriggerRef] = createSignal(void 0);
  const ctx = {
    open,
    requestOpenChange,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    phase: presence.phase,
    present: presence.present,
    modal,
    positioning: props.positioning,
    anchorRef: () => anchorRef() ?? triggerRef(),
    setAnchorRef,
    setTriggerRef,
    triggerRef
  };
  return /* @__PURE__ */ React.createElement(PopoverContext, { value: ctx }, props.children);
}
function Anchor(props) {
  const ctx = usePopoverContext();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: (el) => {
        ctx.setAnchorRef(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "popover",
        part: "anchor"
      })
    },
    props.children
  );
}
function Trigger(props) {
  const ctx = usePopoverContext();
  const handleClick = () => {
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: ctx.triggerId,
      "aria-haspopup": "dialog",
      "aria-expanded": ctx.open() ? "true" : void 0,
      "aria-controls": ctx.open() ? ctx.contentId : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ref: (el) => {
        ctx.setTriggerRef(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "popover",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = usePopoverContext();
  const shouldTrapFocus = () => props.trapFocus ?? ctx.modal;
  let contentEl;
  onSettled(() => {
    if (!contentEl) return;
    const doc = contentEl.ownerDocument;
    const stack = getLayerStack(doc);
    const removeLayer = stack.push({
      id: ctx.contentId,
      element: contentEl,
      modal: ctx.modal
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
    const deactivateFocus = shouldTrapFocus() ? activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => ctx.triggerRef()
    }) : () => {
    };
    let cleanupPositioning;
    const reference = ctx.anchorRef();
    if (ctx.positioning && reference && contentEl) {
      const result = ctx.positioning.update(reference, contentEl);
      if (typeof result === "function") {
        cleanupPositioning = result;
      }
    }
    return () => {
      cleanupPositioning?.();
      deactivateFocus();
      removeDismissable();
      removeLayer();
    };
  });
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      "aria-modal": ctx.modal ? "true" : void 0,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "popover",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  ));
}
function Close(props) {
  const ctx = usePopoverContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "popover", part: "close" })
    },
    props.children
  );
}
export {
  Anchor,
  Close,
  Content,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map