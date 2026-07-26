// src/tree.tsx
import { createSignal, onCleanup, Show } from "solid-js";
import {
  createControllableValue,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs
} from "@solidiom/runtime";

// src/tree-context.ts
import { createContext, useContext } from "solid-js";
var TreeContext = createContext();
function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error("[solidiom] Tree parts must be used within Tree.Root");
  }
  return ctx;
}
var TreeBranchContext = createContext({
  parentId: "",
  depth: 0
});
function useTreeBranchContext() {
  return useContext(TreeBranchContext);
}

// src/tree.tsx
function Root(props) {
  const selectionMode = props.selectionMode ?? "single";
  const baseId = createStableId("tree");
  const { value: expandedIds, requestChange: requestExpandedChange } = createControllableValue({
    value: props.expandedIds,
    defaultValue: props.defaultExpandedIds ?? /* @__PURE__ */ new Set(),
    onChange: props.onExpandedChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id))
  });
  const { value: selectedIds, requestChange: requestSelectedChange } = createControllableValue({
    value: props.selectedIds,
    defaultValue: props.defaultSelectedIds ?? /* @__PURE__ */ new Set(),
    onChange: props.onSelectedChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id))
  });
  const [items, setItems] = createSignal([]);
  const [focusedId, setFocusedId] = createSignal(null);
  const registerItem = (entry) => {
    setItems((prev) => [...prev, entry]);
    return () => setItems((prev) => prev.filter((i) => i.id !== entry.id));
  };
  const typeahead = createTypeahead({
    onMatch: (matched) => {
      setFocusedId(matched.id);
      const item = items().find((i) => i.id === matched.id);
      item?.ref?.focus();
    }
  });
  const ctx = {
    expandedIds,
    requestExpandedChange,
    selectedIds,
    requestSelectedChange,
    selectionMode,
    typeahead,
    baseId,
    registerItem,
    visibleItems: items,
    focusedId,
    setFocusedId
  };
  const handleKeyDown = (e) => {
    const visible = items().filter((i) => !i.disabled);
    const currentId = focusedId();
    const currentIdx = visible.findIndex((i) => i.id === currentId);
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const nextIdx = currentIdx < visible.length - 1 ? currentIdx + 1 : 0;
        const nextItem = visible[nextIdx];
        setFocusedId(nextItem.id);
        nextItem.ref?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prevIdx = currentIdx > 0 ? currentIdx - 1 : visible.length - 1;
        const prevItem = visible[prevIdx];
        setFocusedId(prevItem.id);
        prevItem.ref?.focus();
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (!currentId) break;
        const expanded = expandedIds();
        if (!expanded.has(currentId)) {
          const next = new Set(expanded);
          next.add(currentId);
          requestExpandedChange(next, createChangeDetails("keyboard"));
        } else {
          const children = visible.filter((i) => i.parentId === currentId);
          if (children.length > 0) {
            const firstChild = children[0];
            setFocusedId(firstChild.id);
            firstChild.ref?.focus();
          }
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (!currentId) break;
        const expanded = expandedIds();
        if (expanded.has(currentId)) {
          const next = new Set(expanded);
          next.delete(currentId);
          requestExpandedChange(next, createChangeDetails("keyboard"));
        } else {
          const current = visible.find((i) => i.id === currentId);
          if (current?.parentId) {
            const parent = visible.find((i) => i.id === current.parentId);
            if (parent) {
              setFocusedId(parent.id);
              parent.ref?.focus();
            }
          }
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        if (visible.length > 0) {
          const first = visible[0];
          setFocusedId(first.id);
          first.ref?.focus();
        }
        break;
      }
      case "End": {
        e.preventDefault();
        if (visible.length > 0) {
          const last = visible[visible.length - 1];
          setFocusedId(last.id);
          last.ref?.focus();
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (currentId) {
          selectItem(ctx, currentId);
        }
        break;
      }
      default: {
        const collectionItems = visible.map((i) => ({
          id: i.id,
          disabled: () => i.disabled,
          textValue: () => i.textValue
        }));
        typeahead.handle(e.key, collectionItems, currentId ?? void 0);
      }
    }
  };
  return /* @__PURE__ */ React.createElement(TreeContext, { value: ctx }, /* @__PURE__ */ React.createElement(TreeBranchContext, { value: { parentId: "", depth: 0 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "tree",
      "aria-multiselectable": selectionMode === "multiple" ? "true" : void 0,
      tabindex: 0,
      onKeyDown: handleKeyDown,
      class: props.class,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "tree",
        part: "root"
      })
    },
    props.children
  )));
}
function Item(props) {
  const ctx = useTreeContext();
  const branchCtx = useTreeBranchContext();
  const itemId = props.id;
  const entry = {
    id: itemId,
    depth: branchCtx.depth,
    parentId: branchCtx.parentId || null,
    textValue: props.textValue ?? itemId,
    disabled: props.disabled ?? false
  };
  const cleanup = ctx.registerItem(entry);
  onCleanup(cleanup);
  const isSelected = () => ctx.selectedIds().has(itemId);
  const isExpanded = () => ctx.expandedIds().has(itemId);
  const isFocused = () => ctx.focusedId() === itemId;
  const handleClick = () => {
    if (props.disabled) return;
    ctx.setFocusedId(itemId);
    selectItem(ctx, itemId);
  };
  return /* @__PURE__ */ React.createElement(TreeBranchContext, { value: { parentId: itemId, depth: branchCtx.depth + 1 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: itemId,
      role: "treeitem",
      "aria-expanded": isExpanded() ? "true" : "false",
      "aria-selected": isSelected() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      "aria-level": branchCtx.depth + 1,
      tabindex: isFocused() ? 0 : -1,
      onClick: handleClick,
      class: props.class,
      ref: (el) => {
        entry.ref = el;
        props.ref?.(el);
      },
      ...applySemanticAttrs({
        scope: "tree",
        part: "item",
        state: isSelected() ? "selected" : "unselected",
        disabled: props.disabled
      })
    },
    props.children
  ));
}
function Branch(props) {
  const ctx = useTreeContext();
  const branchCtx = useTreeBranchContext();
  const parentId = branchCtx.parentId;
  const isExpanded = () => ctx.expandedIds().has(parentId);
  return /* @__PURE__ */ React.createElement(Show, { when: isExpanded() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      class: props.class,
      ...applySemanticAttrs({
        scope: "tree",
        part: "branch"
      })
    },
    props.children
  ));
}
function ItemIndicator(props) {
  const branchCtx = useTreeBranchContext();
  const ctx = useTreeContext();
  const parentId = branchCtx.parentId;
  const isExpanded = () => ctx.expandedIds().has(parentId);
  const handleClick = (e) => {
    e.stopPropagation();
    const expanded = ctx.expandedIds();
    const next = new Set(expanded);
    if (next.has(parentId)) {
      next.delete(parentId);
    } else {
      next.add(parentId);
    }
    ctx.requestExpandedChange(next, createChangeDetails("item-click"));
  };
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-hidden": "true",
      onClick: handleClick,
      class: props.class,
      ...applySemanticAttrs({
        scope: "tree",
        part: "item-indicator",
        state: isExpanded() ? "open" : "closed"
      })
    },
    props.children
  );
}
function selectItem(ctx, itemId) {
  const current = ctx.selectedIds();
  if (ctx.selectionMode === "multiple") {
    const next = new Set(current);
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    ctx.requestSelectedChange(next, createChangeDetails("item-click"));
  } else {
    ctx.requestSelectedChange(/* @__PURE__ */ new Set([itemId]), createChangeDetails("item-click"));
  }
  const expanded = ctx.expandedIds();
  const nextExpanded = new Set(expanded);
  if (nextExpanded.has(itemId)) nextExpanded.delete(itemId);
  else nextExpanded.add(itemId);
  ctx.requestExpandedChange(nextExpanded, createChangeDetails("item-click"));
}
export {
  Branch,
  Item,
  ItemIndicator,
  Root
};
//# sourceMappingURL=index.js.map