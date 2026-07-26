// src/toast.tsx
import { createSignal, For, onCleanup } from "solid-js";
import { createStableId, applySemanticAttrs } from "@solidiom/runtime";

// src/toast-context.ts
import { createContext, useContext } from "solid-js";
var ToastContext = createContext();
function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("[solidiom] Toast parts must be used within Toast.Region");
  }
  return ctx;
}

// src/toast.tsx
function createToaster(options = {}) {
  const max = options.max ?? 3;
  const defaultDuration = options.defaultDuration ?? 5e3;
  const [toasts, setToasts] = createSignal([]);
  const dismiss = (id) => {
    setToasts((prev) => {
      const entry = prev.find((t) => t.id === id);
      entry?.onDismiss?.();
      return prev.filter((t) => t.id !== id);
    });
  };
  const toast = (entry) => {
    const id = createStableId("toast");
    const newEntry = {
      id,
      title: entry.title,
      description: entry.description,
      duration: entry.duration ?? defaultDuration,
      onDismiss: entry.onDismiss
    };
    setToasts((prev) => {
      const next = [...prev, newEntry];
      if (next.length > max) {
        const overflow = next.slice(0, next.length - max);
        overflow.forEach((t) => t.onDismiss?.());
        return next.slice(next.length - max);
      }
      return next;
    });
    return id;
  };
  return { toast, dismiss, toasts };
}
function Region(props) {
  const [paused, setPaused] = createSignal(false);
  const timers = /* @__PURE__ */ new Map();
  const dismiss = (id) => {
    clearTimerForId(id);
    props.toaster.dismiss(id);
  };
  const pause = () => {
    setPaused(true);
    for (const [, timer] of timers) {
      clearTimeout(timer);
    }
    timers.clear();
  };
  const resume = () => {
    setPaused(false);
    const current = props.toaster.toasts();
    for (const entry of current) {
      if (entry.duration > 0) {
        startTimer(entry.id, entry.duration);
      }
    }
  };
  const startTimer = (id, duration) => {
    if (paused() || duration <= 0) return;
    clearTimerForId(id);
    const timer = setTimeout(() => {
      timers.delete(id);
      props.toaster.dismiss(id);
    }, duration);
    timers.set(id, timer);
  };
  const clearTimerForId = (id) => {
    const existing = timers.get(id);
    if (existing) {
      clearTimeout(existing);
      timers.delete(id);
    }
  };
  let prevIds = /* @__PURE__ */ new Set();
  const trackToasts = () => {
    const current = props.toaster.toasts();
    const currentIds = new Set(current.map((t) => t.id));
    for (const entry of current) {
      if (!prevIds.has(entry.id) && entry.duration > 0 && !paused()) {
        startTimer(entry.id, entry.duration);
      }
    }
    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        clearTimerForId(id);
      }
    }
    prevIds = currentIds;
  };
  const toastsAccessor = () => {
    trackToasts();
    return props.toaster.toasts();
  };
  onCleanup(() => {
    for (const [, timer] of timers) {
      clearTimeout(timer);
    }
    timers.clear();
  });
  const ctx = {
    toasts: toastsAccessor,
    dismiss,
    pause,
    resume,
    paused
  };
  const handlePointerEnter = () => pause();
  const handlePointerLeave = () => resume();
  return /* @__PURE__ */ React.createElement(ToastContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "region",
      "aria-label": props.label ?? "Notifications",
      "aria-live": "polite",
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      ...applySemanticAttrs({ scope: "toast", part: "region" })
    },
    typeof props.children === "function" ? props.children(toastsAccessor) : /* @__PURE__ */ React.createElement(For, { each: toastsAccessor() }, (entry) => /* @__PURE__ */ React.createElement(ToastRoot, { toastId: entry.id }, /* @__PURE__ */ React.createElement(Title, null, entry.title), entry.description && /* @__PURE__ */ React.createElement(Description, null, entry.description), /* @__PURE__ */ React.createElement(Close, null, "\xD7")))
  ));
}
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "status",
      "aria-atomic": "true",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "toast", part: "root" }),
      "data-toast-id": props.toastId
    },
    props.children
  );
}
var ToastRoot = Root;
function Title(props) {
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "toast", part: "title" }) }, props.children);
}
function Description(props) {
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "toast", part: "description" }) }, props.children);
}
function Close(props) {
  const ctx = useToastContext();
  const handleClick = (e) => {
    const id = props.toastId ?? e.currentTarget.closest("[data-toast-id]")?.getAttribute("data-toast-id");
    if (id) ctx.dismiss(id);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      "aria-label": "Dismiss",
      class: props.class,
      ...applySemanticAttrs({ scope: "toast", part: "close" })
    },
    props.children
  );
}
export {
  Close,
  Description,
  Region,
  Root,
  Title,
  createToaster
};
//# sourceMappingURL=index.js.map