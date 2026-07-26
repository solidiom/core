// src/data-table.tsx
import { createMemo } from "solid-js";
import {
  createControllableValue,
  createStableId,
  createChangeDetails,
  applySemanticAttrs
} from "@solidiom/runtime";

// src/data-table-context.ts
import { createContext, useContext } from "solid-js";
var DataTableContext = createContext();
function useDataTableContext() {
  const ctx = useContext(DataTableContext);
  if (!ctx) {
    throw new Error("[solidiom] DataTable parts must be used within DataTable.Root");
  }
  return ctx;
}

// src/data-table.tsx
function Root(props) {
  const baseId = createStableId("data-table");
  const selectionMode = props.selectionMode ?? "none";
  const rowIdKey = props.rowIdKey ?? "id";
  const allColumnIds = () => new Set(props.columns.map((c) => c.id));
  const { value: sortState, requestChange: requestSortChange } = createControllableValue({
    value: props.sortState,
    defaultValue: props.defaultSortState ?? { columnId: null, direction: "none" },
    onChange: props.onSortChange,
    equals: (a, b) => a.columnId === b.columnId && a.direction === b.direction
  });
  const { value: visibleColumnIds, requestChange: requestVisibilityChange } = createControllableValue({
    value: props.visibleColumnIds,
    defaultValue: props.defaultVisibleColumnIds ?? allColumnIds(),
    onChange: props.onVisibilityChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id))
  });
  const { value: selectedRowIds, requestChange: requestSelectionChange } = createControllableValue({
    value: props.selectedRowIds,
    defaultValue: props.defaultSelectedRowIds ?? /* @__PURE__ */ new Set(),
    onChange: props.onSelectionChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id))
  });
  const rows = createMemo(() => {
    const sort = sortState();
    if (sort.columnId === null || sort.direction === "none") return props.data;
    if (props.modelPort) {
      return props.modelPort.sort(props.data, sort.columnId, sort.direction);
    }
    const col = props.columns.find((c) => c.id === sort.columnId);
    if (!col) return props.data;
    const sorted = [...props.data].sort((a, b) => {
      const aVal = String(a[col.accessorKey] ?? "");
      const bVal = String(b[col.accessorKey] ?? "");
      return aVal.localeCompare(bVal);
    });
    return sort.direction === "desc" ? sorted.reverse() : sorted;
  });
  const ctx = {
    columns: () => props.columns,
    visibleColumnIds,
    requestVisibilityChange,
    sortState,
    requestSortChange,
    selectionMode,
    selectedRowIds,
    requestSelectionChange,
    modelPort: props.modelPort,
    rows,
    rowIdKey,
    baseId
  };
  return /* @__PURE__ */ React.createElement(DataTableContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "table",
    {
      class: props.class,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "data-table", part: "root" })
    },
    props.children
  ));
}
function Header(props) {
  return /* @__PURE__ */ React.createElement("thead", { class: props.class, ...applySemanticAttrs({ scope: "data-table", part: "header" }) }, props.children);
}
function HeaderCell(props) {
  const ctx = useDataTableContext();
  const column = () => ctx.columns().find((c) => c.id === props.columnId);
  const isSortable = () => column()?.sortable ?? false;
  const currentDirection = () => {
    const s = ctx.sortState();
    return s.columnId === props.columnId ? s.direction : "none";
  };
  const toggleSort = (reason) => {
    if (!isSortable()) return;
    const dir = currentDirection();
    const nextDirection = dir === "none" ? "asc" : dir === "asc" ? "desc" : "none";
    ctx.requestSortChange(
      { columnId: props.columnId, direction: nextDirection },
      createChangeDetails(reason)
    );
  };
  const handleClick = () => toggleSort("header-click");
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSort("keyboard");
    }
  };
  return /* @__PURE__ */ React.createElement(
    "th",
    {
      "aria-sort": currentDirection() === "asc" ? "ascending" : currentDirection() === "desc" ? "descending" : void 0,
      tabindex: isSortable() ? 0 : void 0,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      class: props.class,
      ...applySemanticAttrs({
        scope: "data-table",
        part: "header-cell",
        state: currentDirection() !== "none" ? `sorted-${currentDirection()}` : "unsorted"
      })
    },
    props.children
  );
}
function Body(props) {
  return /* @__PURE__ */ React.createElement("tbody", { class: props.class, ...applySemanticAttrs({ scope: "data-table", part: "body" }) }, props.children);
}
function Row(props) {
  const ctx = useDataTableContext();
  const isSelected = () => ctx.selectedRowIds().has(props.rowId);
  const handleClick = () => {
    if (ctx.selectionMode === "none") return;
    const current = ctx.selectedRowIds();
    if (ctx.selectionMode === "multiple") {
      const next = new Set(current);
      if (next.has(props.rowId)) next.delete(props.rowId);
      else next.add(props.rowId);
      ctx.requestSelectionChange(next, createChangeDetails("header-click"));
    } else {
      ctx.requestSelectionChange(/* @__PURE__ */ new Set([props.rowId]), createChangeDetails("header-click"));
    }
  };
  return /* @__PURE__ */ React.createElement(
    "tr",
    {
      "aria-selected": ctx.selectionMode !== "none" ? isSelected() ? "true" : "false" : void 0,
      onClick: handleClick,
      class: props.class,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "data-table",
        part: "row",
        state: isSelected() ? "selected" : "unselected"
      })
    },
    props.children
  );
}
function Cell(props) {
  return /* @__PURE__ */ React.createElement("td", { class: props.class, ...applySemanticAttrs({ scope: "data-table", part: "cell" }) }, props.children);
}
export {
  Body,
  Cell,
  Header,
  HeaderCell,
  Root,
  Row
};
//# sourceMappingURL=index.js.map