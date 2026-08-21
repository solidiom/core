/**
 * @solidiom/adapter-table-tanstack — TanStack Table adapter.
 * Implements TableModelCapability@1 by delegating to @tanstack/table-core.
 *
 * The adapter owns the algorithm (sorting, filtering, row model). The primitive
 * owns semantics (ARIA, DOM, focus, events). Per §0.2: adapters return capability
 * snapshots, not component props or styling.
 */

import {
  columnFilteringFeature,
  constructTable,
  createCoreRowModel,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  type ColumnDef,
  type ColumnFiltersState,
  type RowModel,
  type SortingState,
  type Table,
} from "@tanstack/table-core"
import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings"

/**
 * TanStack Table v9 is feature-modular: row models and behavior plugins are
 * registered once on a `tableFeatures(...)` object rather than passed as
 * per-call `getCoreRowModel()` options (the v8 shape). The core row model is
 * implicit; sorting and filtering are opt-in via their feature + row model.
 */
const tableAdapterFeatures = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  coreRowModel: createCoreRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})

type AdapterFeatures = typeof tableAdapterFeatures
type Data = Record<string, unknown>

// ─── Capability interface ─────────────────────────────────────────────────────

export interface TableColumn {
  id: string
  header: string
  accessorKey: string
}

export interface TableRow {
  id: string
  values: Record<string, unknown>
}

export interface TableSortState {
  columnId: string
  direction: "asc" | "desc"
}

export interface TableFilterState {
  columnId: string
  value: string
}

export interface TableComputeInput {
  data: Record<string, unknown>[]
  columns: TableColumn[]
  sort?: TableSortState
  filters?: TableFilterState[]
}

export interface TableComputeResult {
  rows: TableRow[]
  columns: TableColumn[]
  sortState?: TableSortState
  rowCount: number
}

export interface TableModelCapability {
  compute(input: TableComputeInput): TableComputeResult
  destroy(): void
}

// ─── Adapter implementation ───────────────────────────────────────────────────

export function createTanStackTableAdapter(): TableModelCapability {
  let table: Table<AdapterFeatures, Data> | null = null

  function compute(input: TableComputeInput): TableComputeResult {
    const { data, columns, sort, filters } = input

    const columnDefs: ColumnDef<AdapterFeatures, Data>[] = columns.map((col) => ({
      id: col.id,
      header: col.header,
      accessorKey: col.accessorKey,
    }))

    const sorting: SortingState = sort
      ? [{ id: sort.columnId, desc: sort.direction === "desc" }]
      : []

    const columnFilters: ColumnFiltersState = (filters ?? []).map((f) => ({
      id: f.columnId,
      value: f.value,
    }))

    // v9 tables register features up front; state + data flow through options.
    table = constructTable<AdapterFeatures, Data>({
      features: tableAdapterFeatures,
      data,
      columns: columnDefs,
      state: {
        sorting,
        columnFilters,
      },
      renderFallbackValue: undefined,
    })

    const rowModel: RowModel<AdapterFeatures, Data> = table.getRowModel()

    const rows: TableRow[] = rowModel.rows.map((row) => ({
      id: row.id,
      values: row.original,
    }))

    return {
      rows,
      columns,
      sortState: sort,
      rowCount: rows.length,
    }
  }

  function destroy(): void {
    table = null
  }

  return { compute, destroy }
}
