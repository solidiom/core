/**
 * Data table primitive — headless sortable data table with column visibility,
 * row selection, keyboard sort toggling, and adapter-based sort delegation.
 *
 * Parts: Root (table), Header (thead), HeaderCell (th), Body (tbody), Row (tr), Cell (td).
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails } from "@solidiom/runtime";
import { type ColumnDef, type SortState, type DataTableReason, type RowSelectionMode, type TableModelPort } from "./data-table-context";
/** Props for the data table root. */
export interface DataTableRootProps<T = unknown> {
    /** Column definitions. */
    columns: ColumnDef<T>[];
    /** Row data. */
    data: T[];
    /** Key in each row used as unique row ID. */
    rowIdKey?: string;
    /** Controlled sort state. */
    sortState?: Accessor<SortState>;
    /** Default sort state for uncontrolled mode. */
    defaultSortState?: SortState;
    /** Called when sort state changes. */
    onSortChange?: (state: SortState, details: ChangeDetails<DataTableReason>) => void;
    /** Controlled visible column IDs. */
    visibleColumnIds?: Accessor<Set<string>>;
    /** Default visible column IDs. Defaults to all columns. */
    defaultVisibleColumnIds?: Set<string>;
    /** Called when column visibility changes. */
    onVisibilityChange?: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void;
    /** Row selection mode. Default: "none". */
    selectionMode?: RowSelectionMode;
    /** Controlled selected row IDs. */
    selectedRowIds?: Accessor<Set<string>>;
    /** Default selected row IDs. */
    defaultSelectedRowIds?: Set<string>;
    /** Called when row selection changes. */
    onSelectionChange?: (ids: Set<string>, details: ChangeDetails<DataTableReason>) => void;
    /** Table model port for sort delegation. */
    modelPort?: TableModelPort<T>;
    children: JSX.Element;
    class?: string;
    ref?: (el: HTMLTableElement) => void;
}
/** Root table container managing sort, visibility, and selection state. */
export declare function Root<T = unknown>(props: DataTableRootProps<T>): JSX.Element;
/** Props for the table header (thead). */
export interface DataTableHeaderProps {
    children: JSX.Element;
    class?: string;
}
/** Table header section (thead). */
export declare function Header(props: DataTableHeaderProps): JSX.Element;
/** Props for a sortable table header cell (th). */
export interface DataTableHeaderCellProps {
    /** Column ID this header cell corresponds to. */
    columnId: string;
    children: JSX.Element;
    class?: string;
}
/** Table header cell with sort toggle via click or keyboard. */
export declare function HeaderCell(props: DataTableHeaderCellProps): JSX.Element;
/** Props for the table body (tbody). */
export interface DataTableBodyProps {
    children: JSX.Element;
    class?: string;
}
/** Table body section (tbody). */
export declare function Body(props: DataTableBodyProps): JSX.Element;
/** Props for a table row (tr). */
export interface DataTableRowProps {
    /** Unique row ID. Used for selection tracking. */
    rowId: string;
    children: JSX.Element;
    class?: string;
    ref?: (el: HTMLTableRowElement) => void;
}
/** Table row with selection support. */
export declare function Row(props: DataTableRowProps): JSX.Element;
/** Props for a table cell (td). */
export interface DataTableCellProps {
    children: JSX.Element;
    class?: string;
}
/** Table cell (td). */
export declare function Cell(props: DataTableCellProps): JSX.Element;
//# sourceMappingURL=data-table.d.ts.map