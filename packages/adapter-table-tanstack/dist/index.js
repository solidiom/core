// src/index.ts
import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from "@tanstack/table-core";
function createTanStackTableAdapter() {
  let table = null;
  function compute(input) {
    const { data, columns, sort, filters } = input;
    const columnDefs = columns.map((col) => ({
      id: col.id,
      header: col.header,
      accessorKey: col.accessorKey
    }));
    const sorting = sort ? [{ id: sort.columnId, desc: sort.direction === "desc" }] : [];
    const columnFilters = (filters ?? []).map((f) => ({
      id: f.columnId,
      value: f.value
    }));
    const options = {
      data,
      columns: columnDefs,
      state: {
        sorting,
        columnFilters
      },
      onStateChange: () => {
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: filters?.length ? getFilteredRowModel() : void 0,
      renderFallbackValue: void 0
    };
    table = createTable(options);
    const rowModel = table.getRowModel();
    const rows = rowModel.rows.map((row) => ({
      id: row.id,
      values: row.original
    }));
    return {
      rows,
      columns,
      sortState: sort,
      rowCount: rows.length
    };
  }
  function destroy() {
    table = null;
  }
  return { compute, destroy };
}
export {
  createTanStackTableAdapter
};
//# sourceMappingURL=index.js.map