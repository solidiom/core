import * as DataTable from "@solidiom/data-table"

const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "role", header: "Role", accessorKey: "role" },
]

const data = [
  { name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  { name: "Carol Lee", email: "carol@example.com", role: "Viewer" },
  { name: "Dan Brown", email: "dan@example.com", role: "Editor" },
]

export function DataTableDemo() {
  return (
    <DataTable.Root columns={columns} data={data} class="w-full text-sm">
      <DataTable.Header class="border-b border-[hsl(var(--border))]">
        {columns.map((col) => (
          <DataTable.HeaderCell
            column={col.id}
            class="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]"
          >
            {col.header}
          </DataTable.HeaderCell>
        ))}
      </DataTable.Header>
      <DataTable.Body>
        {data.map((row, i) => (
          <DataTable.Row
            index={i}
            class="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
          >
            {columns.map((col) => (
              <DataTable.Cell class="px-4 py-3">
                {String(row[col.accessorKey as keyof typeof row])}
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))}
      </DataTable.Body>
    </DataTable.Root>
  )
}

export const dataTableDemoCode = `import * as DataTable from "@solidiom/data-table"

const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "role", header: "Role", accessorKey: "role" },
]

function DataTableExample() {
  return (
    <DataTable.Root columns={columns} data={data}>
      <DataTable.Header>
        <DataTable.HeaderCell column="name">Name</DataTable.HeaderCell>
        <DataTable.HeaderCell column="email">Email</DataTable.HeaderCell>
      </DataTable.Header>
      <DataTable.Body>
        <DataTable.Row index={0}>
          <DataTable.Cell>Alice</DataTable.Cell>
          <DataTable.Cell>alice@example.com</DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
    </DataTable.Root>
  )
}`
