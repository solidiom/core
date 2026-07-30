// src/state/controllable-value.ts
import { createSignal } from "solid-js";
function createControllableValue(options) {
  const resolvedDefault = typeof options.defaultValue === "function" ? options.defaultValue() : options.defaultValue;
  const equalsFn = options.equals === void 0 ? Object.is : options.equals;
  const [internal, setInternal] = createSignal(resolvedDefault, {
    equals: equalsFn === false ? false : equalsFn,
    ownedWrite: true
  });
  const isControlled = () => {
    return options.value !== void 0 && options.value() !== void 0;
  };
  const value = () => {
    if (isControlled()) {
      return options.value();
    }
    return internal();
  };
  const requestChange = (next, details) => {
    if (options.disabled?.()) return;
    if (options.readOnly?.()) return;
    if (equalsFn !== false) {
      const current = value();
      if (equalsFn(current, next)) return;
    }
    if (!isControlled()) {
      setInternal(() => next);
    }
    options.onChange?.(next, details);
  };
  return { value, requestChange };
}

// src/state/disclosure-state.ts
function createDisclosureState(options = {}) {
  const controllable = createControllableValue({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
    disabled: options.disabled
  });
  return {
    open: controllable.value,
    requestOpenChange: controllable.requestChange
  };
}

// src/events/change-details.ts
function createChangeDetails(reason, originalEvent) {
  return originalEvent !== void 0 ? { reason, originalEvent } : { reason };
}

// src/events/compose-event-handlers.ts
function composeEventHandlers(...handlers) {
  const filtered = handlers.filter((h) => h != null);
  if (filtered.length === 0) return void 0;
  return (event) => {
    for (const handler of filtered) {
      if (event.defaultPrevented) break;
      if (typeof handler === "function") {
        handler(event);
      } else {
        handler[0](handler[1], event);
      }
    }
  };
}

// src/dom/compose-ref.ts
function composeRef(...refs) {
  return (el) => {
    for (const ref of refs) {
      if (ref) ref(el);
    }
  };
}

// src/dom/stable-id.ts
var counter = 0;
function createStableId(prefix = "solidiom") {
  return `${prefix}-${++counter}`;
}
function resetIdCounter() {
  counter = 0;
}

// src/dom/owner-cleanup.ts
import { onCleanup, getOwner } from "solid-js";
function onOwnerCleanup(cleanup) {
  if (getOwner()) {
    onCleanup(cleanup);
    return true;
  }
  return false;
}
function createDisposable(setup, teardown) {
  setup();
  const registered = onOwnerCleanup(teardown);
  return registered ? () => {
  } : teardown;
}

// src/dom/observe-element.ts
import { onCleanup as onCleanup2, getOwner as getOwner2 } from "solid-js";
function observeElementSize(element, callback) {
  if (typeof ResizeObserver === "undefined") return () => {
  };
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry) callback(entry);
  });
  let currentEl;
  const update = () => {
    const el = element();
    if (el === currentEl) return;
    if (currentEl) observer.unobserve(currentEl);
    currentEl = el;
    if (el) observer.observe(el);
  };
  update();
  const dispose = () => {
    observer.disconnect();
    currentEl = void 0;
  };
  if (getOwner2()) {
    onCleanup2(dispose);
  }
  return dispose;
}
function observeElementMutations(element, callback, options = { childList: true, subtree: true }) {
  if (typeof MutationObserver === "undefined") return () => {
  };
  const observer = new MutationObserver(callback);
  let currentEl;
  const update = () => {
    const el = element();
    if (el === currentEl) return;
    if (currentEl) observer.disconnect();
    currentEl = el;
    if (el) observer.observe(el, options);
  };
  update();
  const dispose = () => {
    observer.disconnect();
    currentEl = void 0;
  };
  if (getOwner2()) {
    onCleanup2(dispose);
  }
  return dispose;
}

// src/dom/semantic-attrs.ts
function applySemanticAttrs(options) {
  const result = {
    "data-scope": options.scope,
    "data-part": options.part
  };
  if (options.state !== void 0) {
    result["data-state"] = options.state;
  }
  if (options.orientation !== void 0) {
    result["data-orientation"] = options.orientation;
  }
  if (options.disabled) result["data-disabled"] = "";
  if (options.loading) result["data-loading"] = "";
  if (options.readonly) result["data-readonly"] = "";
  if (options.required) result["data-required"] = "";
  if (options.invalid) result["data-invalid"] = "";
  if (options.placeholder) result["data-placeholder"] = "";
  if (options.highlighted) result["data-highlighted"] = "";
  if (options.selected) result["data-selected"] = "";
  return result;
}

// src/dom/semantic-vocabulary.ts
var SEMANTIC_FLAGS = [
  "disabled",
  "loading",
  "readonly",
  "required",
  "invalid",
  "placeholder",
  "highlighted",
  "selected"
];
var SEMANTIC_ORIENTATIONS = ["horizontal", "vertical"];
var SEMANTIC_SIDES = ["top", "right", "bottom", "left"];
var SEMANTIC_SIZES = ["sm", "base", "lg"];
var SCOPE_STATES = {
  accordion: ["open", "closed"],
  alert: ["info", "success", "warning", "error"],
  "alert-dialog": ["open", "closed"],
  button: ["on", "off"],
  carousel: ["active", "inactive"],
  checkbox: ["checked", "unchecked", "indeterminate"],
  collapsible: ["open", "closed"],
  combobox: ["open", "closed", "checked", "unchecked"],
  "command-palette": ["open", "closed"],
  "context-menu": ["open", "closed", "checked", "unchecked"],
  "data-table": ["sorted-asc", "sorted-desc", "unsorted", "selected", "unselected"],
  "date-picker": ["open", "closed", "selected", "disabled"],
  dialog: ["open", "closed"],
  drawer: ["open", "closed"],
  "hover-card": ["open", "closed"],
  "input-otp": ["active", "inactive"],
  listbox: ["checked", "unchecked"],
  menu: ["open", "closed", "checked", "unchecked"],
  meter: ["safe", "caution", "danger"],
  "navigation-menu": ["open", "closed", "active"],
  popover: ["open", "closed"],
  progress: ["loading", "complete"],
  "radio-group": ["checked", "unchecked"],
  "resizable-panels": ["collapsed", "expanded"],
  select: ["open", "closed", "checked", "unchecked"],
  sheet: ["open", "closed"],
  switch: ["on", "off"],
  tabs: ["active", "inactive"],
  toggle: ["on", "off"],
  "toggle-group": ["on", "off"],
  toolbar: ["on", "off"],
  tooltip: ["open", "closed"],
  tree: ["open", "closed", "selected", "unselected"]
};
var COMPOSITE_SCOPES = ["prose", "typeset"];
var VOCABULARY_EXCEPTIONS = {
  "date-picker/disabled": {
    reason: 'Emits state="disabled" where disabled is a boolean flag (data-disabled). A state and a flag encode the same condition on the same element.',
    resolvedBy: "PRIM-017"
  },
  "date-picker/selected": {
    reason: 'Emits state="selected" alongside the data-selected boolean flag, so day selection is expressed twice on the same element.',
    resolvedBy: "PRIM-017"
  },
  "data-table/selected": {
    reason: 'Emits state="selected" alongside the data-selected boolean flag, so row selection is expressed twice.',
    resolvedBy: "PRIM-016"
  },
  "data-table/unselected": {
    reason: 'Negative form of state="selected"; absence of the flag already means unselected.',
    resolvedBy: "PRIM-016"
  },
  "data-table/sorted-asc": {
    reason: "Compound state value encoding direction. A dedicated data-sort-direction attribute would be cleaner but is not yet in the vocabulary.",
    resolvedBy: "PRIM-016"
  },
  "data-table/sorted-desc": {
    reason: "See data-table/sorted-asc.",
    resolvedBy: "PRIM-016"
  },
  "progress/loading": {
    reason: 'Emits state="loading" where loading is also a boolean flag (data-loading). Here it means "in progress" rather than "awaiting data", so the collision is semantic as well as syntactic.',
    resolvedBy: "PRIM-033"
  },
  "tree/selected": {
    reason: 'Emits state="selected" alongside the data-selected boolean flag.',
    resolvedBy: "PRIM-050"
  },
  "tree/unselected": {
    reason: 'Negative form of state="selected".',
    resolvedBy: "PRIM-050"
  }
};
var SEMANTIC_ATTRIBUTES = [
  "data-scope",
  "data-part",
  "data-state",
  "data-orientation",
  "data-side",
  "data-size",
  ...SEMANTIC_FLAGS.map((flag) => `data-${flag}`)
];
var ATTRIBUTE_SET = new Set(SEMANTIC_ATTRIBUTES);
function isSemanticAttribute(attribute) {
  return ATTRIBUTE_SET.has(attribute);
}
function isKnownScope(scope) {
  return scope in SCOPE_STATES || COMPOSITE_SCOPES.includes(scope);
}
function statesForScope(scope) {
  return SCOPE_STATES[scope] ?? [];
}
function isKnownState(scope, state) {
  return statesForScope(scope).includes(state);
}
function vocabularyException(scope, state) {
  return VOCABULARY_EXCEPTIONS[`${scope}/${state}`];
}
function allStateValues() {
  return [...new Set(Object.values(SCOPE_STATES).flat())].sort();
}

// src/collection/collection.ts
import { createSignal as createSignal2 } from "solid-js";
function createCollection(options = {}) {
  const [items, setItems] = createSignal2([], { ownedWrite: true });
  const orientation = options.orientation ?? (() => "vertical");
  const direction = options.direction ?? (() => "ltr");
  const sortByDomOrder = (list) => {
    const withRefs = list.filter((item) => item.ref);
    if (withRefs.length <= 1) return list;
    return [...list].sort((a, b) => {
      if (!a.ref || !b.ref) return 0;
      const position = a.ref.compareDocumentPosition(b.ref);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  };
  const registerItem = (item) => {
    setItems((prev) => sortByDomOrder([...prev, item]));
    return () => unregisterItem(item.id);
  };
  const unregisterItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const enabledItems = () => {
    return items().filter((item) => !item.disabled());
  };
  const getItem = (id) => {
    return items().find((item) => item.id === id);
  };
  return {
    items,
    registerItem,
    unregisterItem,
    enabledItems,
    getItem,
    orientation,
    direction
  };
}

// src/collection/composite-navigation.ts
function resolveNavigationIntent(key, options) {
  const { orientation, direction } = options;
  if (key === "Home") return "first";
  if (key === "End") return "last";
  if (key === "PageUp") return "pageUp";
  if (key === "PageDown") return "pageDown";
  const isHorizontal = orientation === "horizontal" || orientation === "both";
  const isVertical = orientation === "vertical" || orientation === "both";
  const isRtl = direction === "rtl";
  if (key === "ArrowDown" && isVertical) return "next";
  if (key === "ArrowUp" && isVertical) return "previous";
  if (key === "ArrowRight" && isHorizontal) {
    return isRtl ? "previous" : "next";
  }
  if (key === "ArrowLeft" && isHorizontal) {
    return isRtl ? "next" : "previous";
  }
  return void 0;
}
function resolveNextItem(enabledItems, currentId, intent, options = {}) {
  const { loop = false, pageSize = 5 } = options;
  if (enabledItems.length === 0) return void 0;
  if (intent === "first") return enabledItems[0];
  if (intent === "last") return enabledItems[enabledItems.length - 1];
  const currentIndex = currentId ? enabledItems.findIndex((item) => item.id === currentId) : -1;
  if (intent === "next") {
    if (currentIndex === -1) return enabledItems[0];
    const nextIndex = currentIndex + 1;
    if (nextIndex >= enabledItems.length) {
      return loop ? enabledItems[0] : void 0;
    }
    return enabledItems[nextIndex];
  }
  if (intent === "previous") {
    if (currentIndex === -1) return enabledItems[enabledItems.length - 1];
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      return loop ? enabledItems[enabledItems.length - 1] : void 0;
    }
    return enabledItems[prevIndex];
  }
  if (intent === "pageDown") {
    if (currentIndex === -1) return enabledItems[0];
    const targetIndex = Math.min(currentIndex + pageSize, enabledItems.length - 1);
    return enabledItems[targetIndex];
  }
  if (intent === "pageUp") {
    if (currentIndex === -1) return enabledItems[enabledItems.length - 1];
    const targetIndex = Math.max(currentIndex - pageSize, 0);
    return enabledItems[targetIndex];
  }
  return void 0;
}

// src/collection/roving-focus.ts
import { createSignal as createSignal3 } from "solid-js";
function createRovingFocus(options = {}) {
  const isControlled = () => options.activeId !== void 0 && options.activeId() !== void 0;
  const [internal, setInternal] = createSignal3(options.defaultActiveId, {
    ownedWrite: true
  });
  const activeId = () => {
    if (isControlled()) return options.activeId();
    return internal();
  };
  const setActiveId = (id, focus = true) => {
    if (!isControlled()) {
      setInternal(id);
    }
    options.onActiveIdChange?.(id);
    if (focus && !options.virtual) {
    }
  };
  const getTabIndex = (itemId) => {
    if (options.virtual) return -1;
    return activeId() === itemId ? 0 : -1;
  };
  const onFocusIn = (enabledItems) => {
    if (!activeId() && enabledItems.length > 0) {
      const first = enabledItems[0];
      setActiveId(first.id, false);
    }
  };
  return { activeId, setActiveId, getTabIndex, onFocusIn };
}

// src/collection/typeahead.ts
function createTypeahead(options = {}) {
  const timeout = options.timeout ?? 500;
  let search = "";
  let timer;
  let composing = false;
  const reset = () => {
    search = "";
    if (timer !== void 0) {
      clearTimeout(timer);
      timer = void 0;
    }
  };
  const compositionStart = () => {
    composing = true;
  };
  const compositionEnd = () => {
    composing = false;
  };
  const handle = (key, items, currentId) => {
    if (composing) return void 0;
    if (key.length !== 1 || key === " ") return void 0;
    if (timer !== void 0) clearTimeout(timer);
    timer = setTimeout(reset, timeout);
    search += key.toLowerCase();
    const enabledItems = items.filter((item) => !item.disabled());
    if (enabledItems.length === 0) return void 0;
    const currentIndex = currentId ? enabledItems.findIndex((item) => item.id === currentId) : -1;
    const startIndex = currentIndex + 1;
    const orderedItems = [...enabledItems.slice(startIndex), ...enabledItems.slice(0, startIndex)];
    const isRepeatedChar = search.length > 1 && new Set(search).size === 1;
    const matchString = isRepeatedChar ? search[0] : search;
    const match = orderedItems.find((item) => {
      const text = item.textValue().toLowerCase();
      return text.startsWith(matchString);
    });
    if (match) {
      options.onMatch?.(match);
    }
    if (isRepeatedChar) {
      search = search[0];
    }
    return match;
  };
  return { handle, reset, compositionStart, compositionEnd };
}

// src/overlay/layer-stack.ts
var stacks = /* @__PURE__ */ new Map();
function getLayerStack(doc) {
  let stack = stacks.get(doc);
  if (!stack) {
    stack = createLayerStack();
    stacks.set(doc, stack);
  }
  return stack;
}
function clearLayerStack(doc) {
  stacks.delete(doc);
}
function createLayerStack() {
  let layers = [];
  const push = (layer) => {
    layers = [...layers, layer];
    return () => remove(layer.id);
  };
  const remove = (id) => {
    layers = layers.filter((l) => l.id !== id);
  };
  const top = () => {
    return layers[layers.length - 1];
  };
  const isTop = (id) => {
    return top()?.id === id;
  };
  const getLayers = () => layers;
  const hasModal = () => {
    return layers.some((l) => l.modal);
  };
  return { push, remove, top, isTop, layers: getLayers, hasModal };
}

// src/overlay/dismissable-layer.ts
function setupDismissableLayer(options) {
  const {
    document: doc,
    layerId,
    element,
    excludeElements,
    escapeKey = true,
    pointerOutside = true,
    focusOutside = true,
    onDismiss
  } = options;
  const stack = getLayerStack(doc);
  const isTargetInside = (target) => {
    if (!target) return false;
    const el = element();
    if (el?.contains(target)) return true;
    const excludes = excludeElements?.() ?? [];
    return excludes.some((ex) => ex.contains(target));
  };
  const handleKeyDown = (event) => {
    if (!escapeKey) return;
    if (event.key !== "Escape") return;
    if (!stack.isTop(layerId)) return;
    event.preventDefault();
    onDismiss("escape-key");
  };
  const handlePointerDown = (event) => {
    if (!pointerOutside) return;
    if (!stack.isTop(layerId)) return;
    if (isTargetInside(event.target)) return;
    onDismiss("pointer-outside");
  };
  const handleFocusIn = (event) => {
    if (!focusOutside) return;
    if (!stack.isTop(layerId)) return;
    if (isTargetInside(event.target)) return;
    onDismiss("focus-outside");
  };
  doc.addEventListener("keydown", handleKeyDown);
  doc.addEventListener("pointerdown", handlePointerDown);
  doc.addEventListener("focusin", handleFocusIn);
  return () => {
    doc.removeEventListener("keydown", handleKeyDown);
    doc.removeEventListener("pointerdown", handlePointerDown);
    doc.removeEventListener("focusin", handleFocusIn);
  };
}

// src/overlay/focus-scope.ts
function getFocusableElements(container) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]"
  ].join(",");
  return Array.from(container.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex >= 0
  );
}
function activateFocusScope(options) {
  const { element, enabled = true, restoreTarget } = options;
  if (!enabled) return () => {
  };
  const doc = element()?.ownerDocument;
  if (!doc) return () => {
  };
  const previouslyFocused = doc.activeElement;
  const container = element();
  if (container) {
    const focusable = getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else if (container instanceof HTMLElement) {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }
  }
  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;
    const el = element();
    if (!el) return;
    const focusable = getFocusableElements(el);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = doc.activeElement;
    if (event.shiftKey) {
      if (active === first || !el.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !el.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  doc.addEventListener("keydown", handleKeyDown, true);
  return () => {
    doc.removeEventListener("keydown", handleKeyDown, true);
    const target = restoreTarget?.() ?? previouslyFocused;
    if (target && target instanceof HTMLElement && target.isConnected) {
      target.focus();
    }
  };
}

// src/overlay/modal-isolation.ts
var refCounts = /* @__PURE__ */ new Map();
var cleanups = /* @__PURE__ */ new Map();
function activateModalIsolation(element) {
  const doc = element.ownerDocument;
  const count = refCounts.get(doc) ?? 0;
  refCounts.set(doc, count + 1);
  if (count === 0) {
    const cleanup = applyInertToSiblings(element);
    cleanups.set(doc, cleanup);
  }
  let deactivated = false;
  return () => {
    if (deactivated) return;
    deactivated = true;
    const current = refCounts.get(doc) ?? 1;
    const next = current - 1;
    refCounts.set(doc, next);
    if (next === 0) {
      refCounts.delete(doc);
      const cleanup = cleanups.get(doc);
      cleanup?.();
      cleanups.delete(doc);
    }
  };
}
function resetModalIsolation() {
  for (const cleanup of cleanups.values()) {
    cleanup();
  }
  refCounts.clear();
  cleanups.clear();
}
function applyInertToSiblings(element) {
  const restore = [];
  let target = element;
  while (target && target.parentElement !== target.ownerDocument.body) {
    target = target.parentElement;
  }
  if (!target) return () => {
  };
  const parent = target.parentElement;
  if (!parent) return () => {
  };
  for (const sibling of Array.from(parent.children)) {
    if (sibling === target) continue;
    if (sibling.tagName === "SCRIPT" || sibling.tagName === "STYLE") continue;
    const hadAriaHidden = sibling.getAttribute("aria-hidden");
    const hadInert = sibling.inert ?? false;
    sibling.setAttribute("aria-hidden", "true");
    if ("inert" in sibling) {
      ;
      sibling.inert = true;
    }
    restore.push({ el: sibling, hadAriaHidden, hadInert });
  }
  return () => {
    for (const { el, hadAriaHidden, hadInert } of restore) {
      if (hadAriaHidden === null) {
        el.removeAttribute("aria-hidden");
      } else {
        el.setAttribute("aria-hidden", hadAriaHidden);
      }
      if ("inert" in el) {
        ;
        el.inert = hadInert;
      }
    }
  };
}

// src/overlay/portal.ts
function resolvePortalTarget(options = {}) {
  if (options.target) return options.target;
  const doc = options.document ?? (typeof document !== "undefined" ? document : void 0);
  if (!doc) return void 0;
  if (options.selector) {
    const resolved = doc.querySelector(options.selector);
    if (resolved) return resolved;
  }
  return doc.body;
}

// src/overlay/scroll-lock.ts
var refCounts2 = /* @__PURE__ */ new Map();
var originals = /* @__PURE__ */ new Map();
function activateScrollLock(doc) {
  const count = refCounts2.get(doc) ?? 0;
  refCounts2.set(doc, count + 1);
  if (count === 0) {
    const body = doc.body;
    const scrollbarWidth = window.innerWidth - doc.documentElement.clientWidth;
    originals.set(doc, {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight
    });
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = refCounts2.get(doc) ?? 1;
    const next = current - 1;
    refCounts2.set(doc, next);
    if (next === 0) {
      refCounts2.delete(doc);
      const original = originals.get(doc);
      if (original) {
        const body = doc.body;
        body.style.overflow = original.overflow;
        body.style.paddingRight = original.paddingRight;
        originals.delete(doc);
      }
    }
  };
}
function resetScrollLock() {
  for (const [doc, original] of originals.entries()) {
    doc.body.style.overflow = original.overflow;
    doc.body.style.paddingRight = original.paddingRight;
  }
  refCounts2.clear();
  originals.clear();
}

// src/presence/presence.ts
import { createSignal as createSignal4, untrack } from "solid-js";
function createPresence(options) {
  const { open, animated = false } = options;
  const initialPhase = untrack(open) ? animated ? "entering" : "entered" : animated ? "exiting" : "exited";
  const [phase, setPhase] = createSignal4(initialPhase, { ownedWrite: true });
  let lastOpen = untrack(open);
  const trackedPhase = () => {
    const isOpen = open();
    if (isOpen !== lastOpen) {
      lastOpen = isOpen;
      if (isOpen) {
        setPhase(animated ? "entering" : "entered");
      } else {
        setPhase(animated ? "exiting" : "exited");
      }
    }
    return phase();
  };
  const present = () => trackedPhase() !== "exited";
  const onEntered = () => {
    if (phase() === "entering") {
      setPhase("entered");
    }
  };
  const onExited = () => {
    if (phase() === "exiting") {
      setPhase("exited");
    }
  };
  return { open, present, phase: trackedPhase, onEntered, onExited };
}

// src/form/form-control.ts
function createFormControl(options = {}) {
  const controlId = options.id ?? createStableId("field");
  const labelId = `${controlId}-label`;
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;
  const state = {
    required: options.required ?? (() => false),
    disabled: options.disabled ?? (() => false),
    readOnly: options.readOnly ?? (() => false),
    invalid: options.invalid ?? (() => false)
  };
  const controlProps = () => ({
    id: controlId,
    "aria-labelledby": labelId,
    "aria-describedby": state.invalid() ? errorId : descriptionId,
    "aria-invalid": state.invalid() ? "true" : void 0,
    "aria-required": state.required() ? "true" : void 0,
    "aria-disabled": state.disabled() ? "true" : void 0,
    "aria-readonly": state.readOnly() ? "true" : void 0
  });
  const labelProps = () => ({
    id: labelId,
    for: controlId
  });
  return {
    controlId,
    labelId,
    descriptionId,
    errorId,
    state,
    controlProps,
    labelProps
  };
}

// src/form/hidden-input.ts
function getHiddenInputProps(options) {
  const { name, value, required, disabled } = options;
  const currentValue = value();
  const isRequired = required?.() ?? false;
  const isDisabled = disabled?.() ?? false;
  const baseStyle = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];
  return values.map((v) => ({
    type: "hidden",
    name,
    value: v,
    required: isRequired,
    disabled: isDisabled,
    "aria-hidden": "true",
    tabIndex: -1,
    style: baseStyle
  }));
}

// src/form/validation.ts
function createValidation(options = {}) {
  let currentMessages = [];
  const messages = () => currentMessages;
  const invalid = () => currentMessages.some((m) => m.severity === "error");
  const setMessages = (msgs) => {
    currentMessages = msgs;
    syncToNative();
  };
  const clear = () => {
    currentMessages = [];
    syncToNative();
  };
  const syncToNative = () => {
    const el = options.element?.();
    if (!el) return;
    const firstError = currentMessages.find((m) => m.severity === "error");
    el.setCustomValidity(firstError?.message ?? "");
  };
  return { messages, invalid, setMessages, clear, syncToNative };
}

// src/i18n/direction.ts
import { createContext, useContext } from "solid-js";
var DirectionContext = createContext("ltr");
function useDirection() {
  return useContext(DirectionContext);
}
function resolveDirection(options = {}) {
  return () => {
    const explicit = options.direction?.();
    if (explicit) return explicit;
    const el = options.element?.();
    if (el) {
      const dir = el.dir || el.closest("[dir]")?.getAttribute("dir");
      if (dir === "rtl" || dir === "ltr") return dir;
    }
    return "ltr";
  };
}

// src/i18n/locale.ts
function resolveLocale(options = {}) {
  return () => {
    const explicit = options.locale?.();
    if (explicit) return explicit;
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language;
    }
    return "en";
  };
}

// src/interaction/pointer-intent.ts
function createPointerIntent(options) {
  const delay = options.delay ?? 150;
  let intentTimer;
  let leaveTimer;
  let isOnTrigger = false;
  let isOnContent = false;
  let isConfirmed = false;
  function clearTimers() {
    if (intentTimer !== void 0) {
      clearTimeout(intentTimer);
      intentTimer = void 0;
    }
    if (leaveTimer !== void 0) {
      clearTimeout(leaveTimer);
      leaveTimer = void 0;
    }
  }
  function handleTriggerEnter() {
    isOnTrigger = true;
    if (leaveTimer !== void 0) {
      clearTimeout(leaveTimer);
      leaveTimer = void 0;
    }
    if (isConfirmed) return;
    clearTimers();
    intentTimer = setTimeout(() => {
      intentTimer = void 0;
      if (isOnTrigger || isOnContent) {
        isConfirmed = true;
        options.onIntentConfirm();
      }
    }, delay);
  }
  function handleTriggerLeave() {
    isOnTrigger = false;
    if (isConfirmed) {
      leaveTimer = setTimeout(() => {
        leaveTimer = void 0;
        if (!isOnTrigger && !isOnContent) {
          isConfirmed = false;
          options.onIntentCancel();
        }
      }, delay);
    } else {
      if (intentTimer !== void 0) {
        clearTimeout(intentTimer);
        intentTimer = void 0;
      }
      leaveTimer = setTimeout(() => {
        leaveTimer = void 0;
        if (!isOnTrigger && !isOnContent) {
          options.onIntentCancel();
        }
      }, delay);
    }
  }
  function handleContentEnter() {
    isOnContent = true;
    if (leaveTimer !== void 0) {
      clearTimeout(leaveTimer);
      leaveTimer = void 0;
    }
    if (!isConfirmed) {
      clearTimers();
      isConfirmed = true;
      options.onIntentConfirm();
    }
  }
  function handleContentLeave() {
    isOnContent = false;
    leaveTimer = setTimeout(() => {
      leaveTimer = void 0;
      if (!isOnTrigger && !isOnContent) {
        isConfirmed = false;
        options.onIntentCancel();
      }
    }, delay);
  }
  function cancel() {
    clearTimers();
    isOnTrigger = false;
    isOnContent = false;
    isConfirmed = false;
  }
  return {
    handleTriggerEnter,
    handleTriggerLeave,
    handleContentEnter,
    handleContentLeave,
    cancel
  };
}
export {
  COMPOSITE_SCOPES,
  DirectionContext,
  SCOPE_STATES,
  SEMANTIC_ATTRIBUTES,
  SEMANTIC_FLAGS,
  SEMANTIC_ORIENTATIONS,
  SEMANTIC_SIDES,
  SEMANTIC_SIZES,
  VOCABULARY_EXCEPTIONS,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  allStateValues,
  applySemanticAttrs,
  clearLayerStack,
  composeEventHandlers,
  composeRef,
  createChangeDetails,
  createCollection,
  createControllableValue,
  createDisclosureState,
  createDisposable,
  createFormControl,
  createPointerIntent,
  createPresence,
  createRovingFocus,
  createStableId,
  createTypeahead,
  createValidation,
  getHiddenInputProps,
  getLayerStack,
  isKnownScope,
  isKnownState,
  isSemanticAttribute,
  observeElementMutations,
  observeElementSize,
  onOwnerCleanup,
  resetIdCounter,
  resetModalIsolation,
  resetScrollLock,
  resolveDirection,
  resolveLocale,
  resolveNavigationIntent,
  resolveNextItem,
  resolvePortalTarget,
  setupDismissableLayer,
  statesForScope,
  useDirection,
  vocabularyException
};
//# sourceMappingURL=index.js.map