// src/drawer.tsx
import { onSettled, Show } from "solid-js";
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

// src/drawer-context.ts
import { createContext, useContext } from "solid-js";
var DrawerContext = createContext();
function useDrawerContext() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("[solidiom] Drawer parts must be used within Drawer.Root");
  }
  return ctx;
}

// src/drawer.tsx
function Root(props) {
  const modal = props.modal ?? true;
  const side = props.side ?? "right";
  const dismissible = props.dismissible ?? true;
  const shouldScaleBackground = props.shouldScaleBackground ?? false;
  const baseId = createStableId("drawer");
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
    modal,
    side,
    snapPoints: props.snapPoints,
    dismissible,
    shouldScaleBackground
  };
  return /* @__PURE__ */ React.createElement(DrawerContext, { value: ctx }, props.children);
}
function Trigger(props) {
  const ctx = useDrawerContext();
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
        scope: "drawer",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Backdrop(props) {
  const ctx = useDrawerContext();
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.modal && ctx.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": "true",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "drawer",
        part: "backdrop",
        state: ctx.open() ? "open" : "closed"
      })
    }
  ));
}
function Content(props) {
  const ctx = useDrawerContext();
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
    const removeDismissable = ctx.dismissible ? setupDismissableLayer({
      document: doc,
      layerId: ctx.contentId,
      element: () => contentEl,
      onDismiss: (reason) => {
        ctx.requestOpenChange(false, createChangeDetails(reason));
      }
    }) : () => {
    };
    const deactivateFocus = ctx.modal ? activateFocusScope({
      element: () => contentEl,
      restoreTarget: () => doc.getElementById(ctx.triggerId)
    }) : () => {
    };
    const deactivateIsolation = ctx.modal ? activateModalIsolation(contentEl) : () => {
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
  });
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      "aria-modal": ctx.modal ? "true" : void 0,
      "aria-labelledby": ctx.titleId,
      "aria-describedby": ctx.descriptionId,
      ref: (el) => {
        contentEl = el;
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "drawer",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      }),
      "data-side": ctx.side,
      "data-snap-points": ctx.snapPoints ? ctx.snapPoints.join(",") : void 0
    },
    props.children
  ));
}
function Close(props) {
  const ctx = useDrawerContext();
  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "drawer", part: "close" })
    },
    props.children
  );
}
function Title(props) {
  const ctx = useDrawerContext();
  return /* @__PURE__ */ React.createElement(
    "h2",
    {
      id: ctx.titleId,
      class: props.class,
      ...applySemanticAttrs({ scope: "drawer", part: "title" })
    },
    props.children
  );
}
function Description(props) {
  const ctx = useDrawerContext();
  return /* @__PURE__ */ React.createElement(
    "p",
    {
      id: ctx.descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "drawer", part: "description" })
    },
    props.children
  );
}
export {
  Backdrop,
  Close,
  Content,
  Description,
  Root,
  Title,
  Trigger
};
//# sourceMappingURL=index.js.map