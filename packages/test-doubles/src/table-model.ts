/**
 * @solidiom/test-doubles — Table model test double implementing TableModelCapability.
 *
 * Deterministic table computation with multi-column sorting, column filtering,
 * and pagination. Zero engine dependencies.
 */

/** A column definition describing how to access and display data. */
export interface ColumnDef {
  /** Unique column identifier. */
  id: string
  /** Display header text. */
  header: string
  /** Key used to access the value from a data record. */
  accessorKey: string
}

/** A row in the computed table model. */
export interface Row {
  /** Stable row identifier (original data index). */
  id: string
  /** Column-keyed values for this row. */
  values: Record<string, unknown>
}

/** Sort state for a single column. */
export interface SortState {
  /** Column being sorted. */
  columnId: string
  /** Sort direction. */
  direction: "asc" | "desc"
}

/** Filter state for a single column. */
export interface FilterState {
  /** Column being filtered. */
  columnId: string
  /** Value to match against. */
  value: string
  /** Comparison operator. */
  operator: "contains" | "equals" | "startsWith" | "endsWith"
}

/** Pagination state. */
export interface PaginationState {
  /** Zero-indexed page number. */
  page: number
  /** Number of rows per page. */
  pageSize: number
}

/** Options controlling computation behavior. */
export interface ComputeOptions {
  /** Multi-column sort in priority order (first entry = primary sort). */
  sort?: SortState[]
  /** Column filters applied before sorting. */
  filters?: FilterState[]
  /** Pagination applied after filtering and sorting. */
  pagination?: PaginationState
}

/** Result of a table model computation. */
export interface TableModelResult {
  /** Rows visible on the current page (after filter/sort/pagination). */
  rows: Row[]
  /** Column definitions passed through. */
  columns: ColumnDef[]
  /** Active sort state (single SortState when shorthand used, array when ComputeOptions used). */
  sortState?: SortState | SortState[]
  /** Total row count after filtering (before pagination). */
  totalRows: number
  /** Total page count when pagination is active. */
  pageCount?: number
}

/** Shorthand: pass a single SortState directly as the third argument. */
export type ComputeSort = SortState | ComputeOptions

/** TableModelCapability port shape for test doubles. */
export interface TableModelCapability {
  /** Computes a filtered, sorted, paginated table model from raw data. */
  compute(
    data: Record<string, unknown>[],
    columns: ColumnDef[],
    options?: ComputeSort,
  ): TableModelResult
  /** Releases resources (no-op for this double). */
  destroy(): void
}

/**
 * Applies a single filter predicate to a string value.
 */
function matchesFilter(cellValue: string, filter: FilterState): boolean {
  const normalized = cellValue.toLowerCase()
  const target = filter.value.toLowerCase()

  switch (filter.operator) {
    case "contains":
      return normalized.includes(target)
    case "equals":
      return normalized === target
    case "startsWith":
      return normalized.startsWith(target)
    case "endsWith":
      return normalized.endsWith(target)
  }
}

/**
 * Compares two rows by multiple sort columns in priority order.
 */
function multiColumnCompare(a: Row, b: Row, sortStates: SortState[], columns: ColumnDef[]): number {
  for (const sort of sortStates) {
    const col = columns.find((c) => c.id === sort.columnId)
    if (!col) continue

    const av = String(a.values[col.accessorKey] ?? "")
    const bv = String(b.values[col.accessorKey] ?? "")
    const cmp = av.localeCompare(bv)

    if (cmp !== 0) {
      return sort.direction === "asc" ? cmp : -cmp
    }
  }
  return 0
}

/**
 * Normalizes the third argument: a bare SortState becomes ComputeOptions with sort array.
 */
function normalizeOptions(options?: ComputeSort): {
  resolved: ComputeOptions | undefined
  shorthand: SortState | undefined
} {
  if (!options) return { resolved: undefined, shorthand: undefined }
  // Detect bare SortState (has `columnId` + `direction`, no `sort`/`filters`/`pagination`)
  if ("columnId" in options && "direction" in options && !("sort" in options)) {
    const sort = options as SortState
    return { resolved: { sort: [sort] }, shorthand: sort }
  }
  return { resolved: options as ComputeOptions, shorthand: undefined }
}

/**
 * Creates a deterministic table model test double.
 *
 * Supports multi-column sorting, column filtering with string operators,
 * and page-based pagination. Produces identical output for identical input.
 *
 * The third argument can be either a full `ComputeOptions` object or a single
 * `SortState` shorthand for simple single-column sort.
 */
export function createTableModelDouble(): TableModelCapability {
  const compute = (
    data: Record<string, unknown>[],
    columns: ColumnDef[],
    rawOptions?: ComputeSort,
  ): TableModelResult => {
    const { resolved: options, shorthand } = normalizeOptions(rawOptions)

    // Map raw data to rows with stable ids
    let rows: Row[] = data.map((item, i) => ({
      id: String(i),
      values: item,
    }))

    // Apply filters
    if (options?.filters && options.filters.length > 0) {
      rows = rows.filter((row) =>
        options.filters!.every((filter) => {
          const col = columns.find((c) => c.id === filter.columnId)
          if (!col) return true
          const cellValue = String(row.values[col.accessorKey] ?? "")
          return matchesFilter(cellValue, filter)
        }),
      )
    }

    const totalRows = rows.length

    // Apply multi-column sort
    if (options?.sort && options.sort.length > 0) {
      rows = [...rows].sort((a, b) => multiColumnCompare(a, b, options.sort!, columns))
    }

    // Apply pagination
    let pageCount: number | undefined
    if (options?.pagination) {
      const { page, pageSize } = options.pagination
      const effectivePageSize = Math.max(1, pageSize)
      pageCount = Math.ceil(totalRows / effectivePageSize)
      const start = page * effectivePageSize
      rows = rows.slice(start, start + effectivePageSize)
    }

    return {
      rows,
      columns,
      // When shorthand was used, return the single SortState; otherwise the array
      sortState: shorthand ?? options?.sort,
      totalRows,
      pageCount,
    }
  }

  const destroy = (): void => {
    // No-op: stateless double holds no resources.
  }

  return { compute, destroy }
}
