/**
 * Data table context — shared state between DataTable parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails } from "@solidiom/runtime"

/** Sort direction for a column. */
export type SortDirection = "asc" | "desc" | "none"

/** Reason for a table state change. */
export type DataTableReason = "header-click" | "keyboard" | "programmatic"

/** Current sort state. */
export interface SortState {
  columnId: string | null
  direction: SortDirection
}

/** Column definition model. */
export interface ColumnDef<T = unknown> {
  /** Unique column identifier. */
  id: string
  /** Header label or render function. */
  header: string
  /** Key to access the row data value. */
  accessorKey: keyof T & string
  /** Whether this column is sortable. Default: false. */
  sortable?: boolean
}

/** Selection mode for rows. */
export type RowSelectionMode = "single" | "multiple" | "none"

/**
 * Port interface for delegating sort computation to an adapter.
 * Following the adapter pattern used by calendar/carousel.
 */
export interface TableModelPort<T = unknown> {
  /** Sort rows by column and direction. Return sorted rows. */
  sort(rows: T[], columnId: string, direction: SortDirection): T[]
}

/** Shared reactive state and mutation requests for every DataTable part. */
export interface DataTableContextValue<T = unknown> {
  /** Column definitions. */
  columns: Accessor<ColumnDef<T>[]>
  /** Visible column IDs. */
  visibleColumnIds: Accessor<Set<string>>
  /** Request column visibility change. */
  requestVisibilityChange: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void
  /** Current sort state. */
  sortState: Accessor<SortState>
  /** Request sort state change. */
  requestSortChange: (state: SortState, details: ChangeDetails<DataTableReason>) => void
  /** Row selection mode. */
  selectionMode: RowSelectionMode
  /** Selected row IDs. */
  selectedRowIds: Accessor<Set<string>>
  /** Request row selection change. */
  requestSelectionChange: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void
  /** Table model port for sorting delegation. */
  modelPort: TableModelPort<T> | undefined
  /** Sorted/processed rows. */
  rows: Accessor<T[]>
  /** Row ID accessor key. */
  rowIdKey: string
  /** Generated base ID. */
  baseId: string
}

export const DataTableContext = createContext<DataTableContextValue<any>>()

/** Access the data table context. Throws if used outside Root. */
export function useDataTableContext<T = unknown>(): DataTableContextValue<T> {
  const ctx = useContext(DataTableContext)
  if (!ctx) {
    throw new Error("[solidiom] DataTable parts must be used within DataTable.Root")
  }
  return ctx as DataTableContextValue<T>
}
