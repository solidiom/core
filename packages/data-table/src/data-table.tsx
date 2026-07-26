/**
 * Data table primitive — headless sortable data table with column visibility,
 * row selection, keyboard sort toggling, and adapter-based sort delegation.
 *
 * Parts: Root (table), Header (thead), HeaderCell (th), Body (tbody), Row (tr), Cell (td).
 */

import { type Accessor, createMemo } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  type ChangeDetails,
} from "@solidiom/runtime"
import {
  DataTableContext,
  useDataTableContext,
  type DataTableContextValue,
  type ColumnDef,
  type SortState,
  type SortDirection,
  type DataTableReason,
  type RowSelectionMode,
  type TableModelPort,
} from "./data-table-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the data table root. */
export interface DataTableRootProps<T = unknown> {
  /** Column definitions. */
  columns: ColumnDef<T>[]
  /** Row data. */
  data: T[]
  /** Key in each row used as unique row ID. */
  rowIdKey?: string
  /** Controlled sort state. */
  sortState?: Accessor<SortState>
  /** Default sort state for uncontrolled mode. */
  defaultSortState?: SortState
  /** Called when sort state changes. */
  onSortChange?: (state: SortState, details: ChangeDetails<DataTableReason>) => void
  /** Controlled visible column IDs. */
  visibleColumnIds?: Accessor<Set<string>>
  /** Default visible column IDs. Defaults to all columns. */
  defaultVisibleColumnIds?: Set<string>
  /** Called when column visibility changes. */
  onVisibilityChange?: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void
  /** Row selection mode. Default: "none". */
  selectionMode?: RowSelectionMode
  /** Controlled selected row IDs. */
  selectedRowIds?: Accessor<Set<string>>
  /** Default selected row IDs. */
  defaultSelectedRowIds?: Set<string>
  /** Called when row selection changes. */
  onSelectionChange?: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void
  /** Table model port for sort delegation. */
  modelPort?: TableModelPort<T>
  children: JSX.Element
  class?: string
  ref?: (el: HTMLTableElement) => void
}

/** Root table container managing sort, visibility, and selection state. */
export function Root<T = unknown>(props: DataTableRootProps<T>) {
  const baseId = createStableId("data-table")
  const selectionMode = props.selectionMode ?? "none"
  const rowIdKey = props.rowIdKey ?? "id"

  const allColumnIds = () => new Set(props.columns.map((c) => c.id))

  const { value: sortState, requestChange: requestSortChange } = createControllableValue<
    SortState,
    DataTableReason
  >({
    value: props.sortState,
    defaultValue: props.defaultSortState ?? { columnId: null, direction: "none" },
    onChange: props.onSortChange,
    equals: (a, b) => a.columnId === b.columnId && a.direction === b.direction,
  })

  const { value: visibleColumnIds, requestChange: requestVisibilityChange } =
    createControllableValue<Set<string>, DataTableReason>({
      value: props.visibleColumnIds,
      defaultValue: props.defaultVisibleColumnIds ?? allColumnIds(),
      onChange: props.onVisibilityChange,
      equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id)),
    })

  const { value: selectedRowIds, requestChange: requestSelectionChange } = createControllableValue<
    Set<string>,
    DataTableReason
  >({
    value: props.selectedRowIds,
    defaultValue: props.defaultSelectedRowIds ?? new Set(),
    onChange: props.onSelectionChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id)),
  })

  const rows = createMemo((): T[] => {
    const sort = sortState()
    if (sort.columnId === null || sort.direction === "none") return props.data

    if (props.modelPort) {
      return props.modelPort.sort(props.data, sort.columnId, sort.direction)
    }

    // Default sort: string comparison on accessor key
    const col = props.columns.find((c) => c.id === sort.columnId)
    if (!col) return props.data

    const sorted = [...props.data].sort((a, b) => {
      const aVal = String((a as any)[col.accessorKey] ?? "")
      const bVal = String((b as any)[col.accessorKey] ?? "")
      return aVal.localeCompare(bVal)
    })
    return sort.direction === "desc" ? sorted.reverse() : sorted
  })

  const ctx: DataTableContextValue<T> = {
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
    baseId,
  }

  return (
    <DataTableContext value={ctx}>
      <table
        class={props.class}
        ref={props.ref}
        {...applySemanticAttrs({ scope: "data-table", part: "root" })}
      >
        {props.children}
      </table>
    </DataTableContext>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

/** Props for the table header (thead). */
export interface DataTableHeaderProps {
  children: JSX.Element
  class?: string
}

/** Table header section (thead). */
export function Header(props: DataTableHeaderProps) {
  return (
    <thead class={props.class} {...applySemanticAttrs({ scope: "data-table", part: "header" })}>
      {props.children}
    </thead>
  )
}

// ─── HeaderCell ────────────────────────────────────────────────────────────────

/** Props for a sortable table header cell (th). */
export interface DataTableHeaderCellProps {
  /** Column ID this header cell corresponds to. */
  columnId: string
  children: JSX.Element
  class?: string
}

/** Table header cell with sort toggle via click or keyboard. */
export function HeaderCell(props: DataTableHeaderCellProps) {
  const ctx = useDataTableContext()

  const column = () => ctx.columns().find((c) => c.id === props.columnId)
  const isSortable = () => column()?.sortable ?? false

  const currentDirection = (): SortDirection => {
    const s = ctx.sortState()
    return s.columnId === props.columnId ? s.direction : "none"
  }

  const toggleSort = (reason: DataTableReason) => {
    if (!isSortable()) return
    const dir = currentDirection()
    const nextDirection: SortDirection = dir === "none" ? "asc" : dir === "asc" ? "desc" : "none"
    ctx.requestSortChange(
      { columnId: props.columnId, direction: nextDirection },
      createChangeDetails(reason),
    )
  }

  const handleClick = () => toggleSort("header-click")

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleSort("keyboard")
    }
  }

  return (
    <th
      aria-sort={
        currentDirection() === "asc"
          ? "ascending"
          : currentDirection() === "desc"
            ? "descending"
            : undefined
      }
      tabindex={isSortable() ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      class={props.class}
      {...applySemanticAttrs({
        scope: "data-table",
        part: "header-cell",
        state: currentDirection() !== "none" ? `sorted-${currentDirection()}` : "unsorted",
      })}
    >
      {props.children}
    </th>
  )
}

// ─── Body ──────────────────────────────────────────────────────────────────────

/** Props for the table body (tbody). */
export interface DataTableBodyProps {
  children: JSX.Element
  class?: string
}

/** Table body section (tbody). */
export function Body(props: DataTableBodyProps) {
  return (
    <tbody class={props.class} {...applySemanticAttrs({ scope: "data-table", part: "body" })}>
      {props.children}
    </tbody>
  )
}

// ─── Row ───────────────────────────────────────────────────────────────────────

/** Props for a table row (tr). */
export interface DataTableRowProps {
  /** Unique row ID. Used for selection tracking. */
  rowId: string
  children: JSX.Element
  class?: string
  ref?: (el: HTMLTableRowElement) => void
}

/** Table row with selection support. */
export function Row(props: DataTableRowProps) {
  const ctx = useDataTableContext()

  const isSelected = () => ctx.selectedRowIds().has(props.rowId)

  const handleClick = () => {
    if (ctx.selectionMode === "none") return
    const current = ctx.selectedRowIds()
    if (ctx.selectionMode === "multiple") {
      const next = new Set(current)
      if (next.has(props.rowId)) next.delete(props.rowId)
      else next.add(props.rowId)
      ctx.requestSelectionChange(next, createChangeDetails("header-click"))
    } else {
      ctx.requestSelectionChange(new Set([props.rowId]), createChangeDetails("header-click"))
    }
  }

  return (
    <tr
      aria-selected={ctx.selectionMode !== "none" ? (isSelected() ? "true" : "false") : undefined}
      onClick={handleClick}
      class={props.class}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "data-table",
        part: "row",
        state: isSelected() ? "selected" : "unselected",
      })}
    >
      {props.children}
    </tr>
  )
}

// ─── Cell ──────────────────────────────────────────────────────────────────────

/** Props for a table cell (td). */
export interface DataTableCellProps {
  children: JSX.Element
  class?: string
}

/** Table cell (td). */
export function Cell(props: DataTableCellProps) {
  return (
    <td class={props.class} {...applySemanticAttrs({ scope: "data-table", part: "cell" })}>
      {props.children}
    </td>
  )
}
