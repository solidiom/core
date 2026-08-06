/**
 * Styled DataTable — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/data-table.css"`
 */
import * as DataTable from "@solidiom/data-table"

export { DataTable }

const BASE_CLASS = "solidiom-data-table"

export interface StyledDataTableProps
  extends Omit<Parameters<typeof DataTable.Root>[0], "class"> {
  class?: string
}

export function StyledDataTable(props: StyledDataTableProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <DataTable.Root {...props} class={className()} />
}