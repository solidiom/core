// src/index.tsx
import { Show, onSettled, createContext, useContext } from "solid-js";
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
var SheetContext = createContext();
function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("[solidiom] Sheet parts must be used within Sheet.Root");
  }
  return ctx;
}
function Root(props) {
  const side = props.side ?? "right";
  const baseId = createStableId("sheet");
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
    present: presence.present,
    side
  };
  return /* @__PURE__ */ React.createElement(SheetContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useSheetContext();
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
        scope: "sheet",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Portal(props) {
  const ctx = useSheetContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, props.children);
}
function Backdrop(props) {
  const ctx = useSheetContext();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "sheet",
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
  const ctx = useSheetContext();
  const shouldTrapFocus = () => props.trapFocus ?? true;
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
      onDismiss: (reason) => {
        ctx.requestOpenChange(false, createChangeDetails(reason));
      }
    });
    const deactivateFocus = shouldTrapFocus() ? activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => doc.getElementById(ctx.triggerId)
    }) : () => {
    };
    const deactivateIsolation = activateModalIsolation(contentEl);
    const releaseScroll = activateScrollLock(doc);
    return () => {
      releaseScroll();
      deactivateIsolation();
      deactivateFocus();
      removeDismissable();
      removeLayer();
    };
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": ctx.titleId,
      "aria-describedby": ctx.descriptionId,
      "data-side": ctx.side,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "sheet",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Title(props) {
  const ctx = useSheetContext();
  return /* @__PURE__ */ React.createElement(
    "h2",
    {
      id: ctx.titleId,
      class: props.class,
      ...applySemanticAttrs({ scope: "sheet", part: "title" })
    },
    props.children
  );
}
function Description(props) {
  const ctx = useSheetContext();
  return /* @__PURE__ */ React.createElement(
    "p",
    {
      id: ctx.descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "sheet", part: "description" })
    },
    props.children
  );
}
function Close(props) {
  const ctx = useSheetContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "sheet", part: "close" })
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