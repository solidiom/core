import * as DataTable from "@solidiom/data-table"
import type { Locale } from "../lib/locale"

interface Language {
  id: string
  name: string
  year: string
  paradigm: string
}

const COLUMN_HEADERS: Record<Locale, { name: string; year: string; paradigm: string }> = {
  en: { name: "Name", year: "Year", paradigm: "Paradigm" },
  es: { name: "Nombre", year: "Año", paradigm: "Paradigma" },
}

const DATA: Language[] = [
  { id: "1", name: "Rust", year: "2010", paradigm: "Systems" },
  { id: "2", name: "TypeScript", year: "2012", paradigm: "Multi-paradigm" },
  { id: "3", name: "Go", year: "2009", paradigm: "Concurrent" },
  { id: "4", name: "Kotlin", year: "2011", paradigm: "Object-oriented" },
  { id: "5", name: "Swift", year: "2014", paradigm: "Multi-paradigm" },
  { id: "6", name: "Elixir", year: "2011", paradigm: "Functional" },
]

export interface DataTableExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Data Table documentation example.
 * The matching content entry declares this file as its source so rendered code
 * and the live behavior do not drift apart.
 */
export function DataTableExample(props: DataTableExampleProps) {
  const headers = () => COLUMN_HEADERS[props.locale]

  const columns = () => [
    { id: "name", header: headers().name, accessorKey: "name" as const, sortable: true },
    { id: "year", header: headers().year, accessorKey: "year" as const, sortable: true },
    { id: "paradigm", header: headers().paradigm, accessorKey: "paradigm" as const, sortable: true },
  ]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="data-table-example"
      data-data-table-example
    >
      <DataTable.Root columns={columns()} data={DATA}>
        <DataTable.Header>
          <tr>
            <DataTable.HeaderCell columnId="name">
              <span class="data-table-example__header-label">{headers().name}</span>
            </DataTable.HeaderCell>
            <DataTable.HeaderCell columnId="year">
              <span class="data-table-example__header-label">{headers().year}</span>
            </DataTable.HeaderCell>
            <DataTable.HeaderCell columnId="paradigm">
              <span class="data-table-example__header-label">{headers().paradigm}</span>
            </DataTable.HeaderCell>
          </tr>
        </DataTable.Header>
        <DataTable.Body>
          {DATA.map((row) => (
            <DataTable.Row rowId={row.id}>
              <DataTable.Cell>
                <span class="data-table-example__cell-text">{row.name}</span>
              </DataTable.Cell>
              <DataTable.Cell>
                <span class="data-table-example__cell-text">{row.year}</span>
              </DataTable.Cell>
              <DataTable.Cell>
                <span class="data-table-example__cell-text">{row.paradigm}</span>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable.Root>
    </div>
  )
}
