/**
 * @solidiom/test-doubles — Table model test double implementing TableModelCapability.
 *
 * Deterministic table computation with multi-column sorting, column filtering,
 * and pagination. Zero engine dependencies.
 */
/** A column definition describing how to access and display data. */
export interface ColumnDef {
    /** Unique column identifier. */
    id: string;
    /** Display header text. */
    header: string;
    /** Key used to access the value from a data record. */
    accessorKey: string;
}
/** A row in the computed table model. */
export interface Row {
    /** Stable row identifier (original data index). */
    id: string;
    /** Column-keyed values for this row. */
    values: Record<string, unknown>;
}
/** Sort state for a single column. */
export interface SortState {
    /** Column being sorted. */
    columnId: string;
    /** Sort direction. */
    direction: "asc" | "desc";
}
/** Filter state for a single column. */
export interface FilterState {
    /** Column being filtered. */
    columnId: string;
    /** Value to match against. */
    value: string;
    /** Comparison operator. */
    operator: "contains" | "equals" | "startsWith" | "endsWith";
}
/** Pagination state. */
export interface PaginationState {
    /** Zero-indexed page number. */
    page: number;
    /** Number of rows per page. */
    pageSize: number;
}
/** Options controlling computation behavior. */
export interface ComputeOptions {
    /** Multi-column sort in priority order (first entry = primary sort). */
    sort?: SortState[];
    /** Column filters applied before sorting. */
    filters?: FilterState[];
    /** Pagination applied after filtering and sorting. */
    pagination?: PaginationState;
}
/** Result of a table model computation. */
export interface TableModelResult {
    /** Rows visible on the current page (after filter/sort/pagination). */
    rows: Row[];
    /** Column definitions passed through. */
    columns: ColumnDef[];
    /** Active sort state (single SortState when shorthand used, array when ComputeOptions used). */
    sortState?: SortState | SortState[];
    /** Total row count after filtering (before pagination). */
    totalRows: number;
    /** Total page count when pagination is active. */
    pageCount?: number;
}
/** Shorthand: pass a single SortState directly as the third argument. */
export type ComputeSort = SortState | ComputeOptions;
/** TableModelCapability port shape for test doubles. */
export interface TableModelCapability {
    /** Computes a filtered, sorted, paginated table model from raw data. */
    compute(data: Record<string, unknown>[], columns: ColumnDef[], options?: ComputeSort): TableModelResult;
    /** Releases resources (no-op for this double). */
    destroy(): void;
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
export declare function createTableModelDouble(): TableModelCapability;
//# sourceMappingURL=table-model.d.ts.map