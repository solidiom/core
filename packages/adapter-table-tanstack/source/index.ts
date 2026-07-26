/**
 * @solidiom/adapter-table-tanstack — TanStack Table adapter.
 * Implements TableModelCapability@1 by delegating to @tanstack/table-core.
 *
 * The adapter owns the algorithm (sorting, filtering, row model). The primitive
 * owns semantics (ARIA, DOM, focus, events). Per §0.2: adapters return capability
 * snapshots, not component props or styling.
 */

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type Table,
  type TableOptionsResolved,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowModel,
} from "@tanstack/table-core"

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
  let table: Table<Record<string, unknown>> | null = null

  function compute(input: TableComputeInput): TableComputeResult {
    const { data, columns, sort, filters } = input

    const columnDefs: ColumnDef<Record<string, unknown>>[] = columns.map((col) => ({
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

    // TanStack Table requires a full options object with state + callbacks.
    const options: TableOptionsResolved<Record<string, unknown>> = {
      data,
      columns: columnDefs,
      state: {
        sorting,
        columnFilters,
      },
      onStateChange: () => {},
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: filters?.length ? getFilteredRowModel() : undefined,
      renderFallbackValue: undefined,
    }

    table = createTable(options)

    const rowModel: RowModel<Record<string, unknown>> = table.getRowModel()

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
