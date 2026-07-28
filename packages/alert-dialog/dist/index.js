// src/index.tsx
import { Show, onSettled, createContext, useContext } from "solid-js";
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  createChangeDetails
} from "@solidiom/runtime";
var AlertDialogContext = createContext();
function useAlertDialogContext() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error("[solidiom] AlertDialog parts must be used within AlertDialog.Root");
  return ctx;
}
function Root(props) {
  const baseId = createStableId("alert-dialog");
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const presence = createPresence({ open });
  const ctx = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    phase: presence.phase,
    present: presence.present
  };
  return /* @__PURE__ */ React.createElement(AlertDialogContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useAlertDialogContext();
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
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "alert-dialog",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Portal(props) {
  const ctx = useAlertDialogContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, props.children);
}
function Content(props) {
  const ctx = useAlertDialogContext();
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
    const deactivateFocus = activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => doc.getElementById(ctx.triggerId)
    });
    const deactivateIsolation = activateModalIsolation(contentEl);
    const releaseScroll = activateScrollLock(doc);
    return () => {
      releaseScroll();
      deactivateIsolation();
      deactivateFocus();
      removeLayer();
    };
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": ctx.titleId,
      "aria-describedby": ctx.descriptionId,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "alert-dialog",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Title(props) {
  const ctx = useAlertDialogContext();
  return /* @__PURE__ */ React.createElement(
    "h2",
    {
      id: ctx.titleId,
      class: props.class,
      ...applySemanticAttrs({ scope: "alert-dialog", part: "title" })
    },
    props.children
  );
}
function Description(props) {
  const ctx = useAlertDialogContext();
  return /* @__PURE__ */ React.createElement(
    "p",
    {
      id: ctx.descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "alert-dialog", part: "description" })
    },
    props.children
  );
}
function Cancel(props) {
  const ctx = useAlertDialogContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "alert-dialog",
        part: "cancel",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Action(props) {
  const ctx = useAlertDialogContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("programmatic"));
    props.onAction?.();
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "alert-dialog",
        part: "action",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
export {
  Action,
  Cancel,
  Content,
  Description,
  Portal,
  Root,
  Title,
  Trigger
};
//# sourceMappingURL=index.js.map