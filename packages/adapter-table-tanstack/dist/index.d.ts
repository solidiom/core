/**
 * @solidiom/adapter-table-tanstack — TanStack Table adapter.
 * Implements TableModelCapability@1 by delegating to @tanstack/table-core.
 *
 * The adapter owns the algorithm (sorting, filtering, row model). The primitive
 * owns semantics (ARIA, DOM, focus, events). Per §0.2: adapters return capability
 * snapshots, not component props or styling.
 */
export interface TableColumn {
    id: string;
    header: string;
    accessorKey: string;
}
export interface TableRow {
    id: string;
    values: Record<string, unknown>;
}
export interface TableSortState {
    columnId: string;
    direction: "asc" | "desc";
}
export interface TableFilterState {
    columnId: string;
    value: string;
}
export interface TableComputeInput {
    data: Record<string, unknown>[];
    columns: TableColumn[];
    sort?: TableSortState;
    filters?: TableFilterState[];
}
export interface TableComputeResult {
    rows: TableRow[];
    columns: TableColumn[];
    sortState?: TableSortState;
    rowCount: number;
}
export interface TableModelCapability {
    compute(input: TableComputeInput): TableComputeResult;
    destroy(): void;
}
export declare function createTanStackTableAdapter(): TableModelCapability;
//# sourceMappingURL=index.d.ts.map