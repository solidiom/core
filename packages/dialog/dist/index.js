// src/dialog.tsx
import { createEffect, createSignal, Show } from "solid-js";
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  createChangeDetails
} from "@solidiom/runtime";

// src/dialog-context.ts
import { createContext, useContext } from "solid-js";
var DialogContext = createContext();
function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("[solidiom] Dialog parts must be used within Dialog.Root");
  }
  return ctx;
}

// src/dialog.tsx
function Root(props) {
  const modal = props.modal ?? true;
  const baseId = createStableId("dialog");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const presence = createPresence({ open });
  const [triggerEl, setTriggerEl] = createSignal();
  const ctx = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    triggerEl,
    setTriggerEl,
    phase: presence.phase,
    present: presence.present,
    modal
  };
  return /* @__PURE__ */ React.createElement(DialogContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useDialogContext();
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
      ref: (el) => {
        ctx.setTriggerEl(el);
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "dialog",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Portal(props) {
  const ctx = useDialogContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, props.children);
}
function Backdrop(props) {
  const ctx = useDialogContext();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "dialog",
        part: "backdrop",
        state: ctx.open() ? "open" : "closed"
      }),
      class: props.class,
      style: props.style,
      "aria-hidden": "true"
    }
  );
}
function Content(props) {
  const ctx = useDialogContext();
  const shouldTrapFocus = () => props.trapFocus ?? true;
  const [contentEl, setContentEl] = createSignal();
  createEffect(
    () => ctx.present() ? contentEl() : void 0,
    (el) => {
      if (!el) return;
      const doc = el.ownerDocument;
      const stack = getLayerStack(doc);
      const removeLayer = stack.push({
        id: ctx.contentId,
        element: el,
        modal: ctx.modal
      });
      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.contentId,
        element: () => el,
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason));
        }
      });
      const deactivateFocus = shouldTrapFocus() ? activateFocusScope({
        element: () => el,
        restoreTarget: () => ctx.triggerEl() ?? doc.getElementById(ctx.triggerId)
      }) : () => {
      };
      const deactivateIsolation = ctx.modal ? activateModalIsolation(el) : () => {
      };
      const releaseScroll = ctx.modal ? activateScrollLock(doc) : () => {
      };
      return () => {
        releaseScroll();
        deactivateIsolation();
        deactivateFocus();
        removeDismissable();
        removeLayer();
      };
    }
  );
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      "aria-modal": ctx.modal ? "true" : void 0,
      "aria-labelledby": ctx.titleId,
      "aria-describedby": ctx.descriptionId,
      ref: (el) => {
        setContentEl(el);
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "dialog",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Title(props) {
  const ctx = useDialogContext();
  return /* @__PURE__ */ React.createElement(
    "h2",
    {
      id: ctx.titleId,
      class: props.class,
      ...applySemanticAttrs({ scope: "dialog", part: "title" })
    },
    props.children
  );
}
function Description(props) {
  const ctx = useDialogContext();
  return /* @__PURE__ */ React.createElement(
    "p",
    {
      id: ctx.descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "dialog", part: "description" })
    },
    props.children
  );
}
function Close(props) {
  const ctx = useDialogContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "dialog", part: "close" })
    },
    props.children
  );
}
export {
  Backdrop,
  Close,
  Content,
  Description,
  Portal,
  Root,
  Title,
  Trigger
};
//# sourceMappingURL=index.js.map