import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"

const FORMATS = [
  { id: "csv", name: "CSV", description: "Comma-separated values for spreadsheet import.", icon: "📄" },
  { id: "json", name: "JSON", description: "Structured JSON for programmatic access.", icon: "🔧" },
  { id: "pdf", name: "PDF Report", description: "Formatted compliance report with summary.", icon: "📋" },
  { id: "xml", name: "XML", description: "XML format for enterprise system integration.", icon: "📦" },
]

export function Export(): JSX.Element {
  const [format, setFormat] = createSignal("csv")
  const [dateFrom, setDateFrom] = createSignal("2025-08-01")
  const [dateTo, setDateTo] = createSignal("2025-08-10")
  const [exporting, setExporting] = createSignal(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => setExporting(false), 2000)
  }

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/export" current class="text-gray-900 font-medium">Export</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Export</h1>
        <p class="mt-1 text-sm text-gray-500">Export filtered audit data in your preferred format for compliance and analysis.</p>
      </div>

      <Alert.Root type="success" class="rounded-md border border-green-200 bg-green-50 p-4">
        <Alert.Title class="text-sm font-medium text-green-800">Export Ready</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-green-700">
          1,247 events available for export in the selected date range. Choose a format and generate your report.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map((f) => (
          <Card.Root
            class={`cursor-pointer rounded-lg border p-6 shadow-sm transition-colors ${
              format() === f.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setFormat(f.id)}
          >
            <div class="text-2xl">{f.icon}</div>
            <Card.Title class="mt-3 text-base font-semibold text-gray-900">{f.name}</Card.Title>
            <p class="mt-1 text-sm text-gray-500">{f.description}</p>
          </Card.Root>
        ))}
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="border-b border-gray-100 px-6 py-4">
          <Card.Title class="text-base font-semibold text-gray-900">Date Range</Card.Title>
        </Card.Header>
        <Card.Content class="px-6 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={dateFrom()}
                onChange={(e) => setDateFrom(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={dateTo()}
                onChange={(e) => setDateTo(e.currentTarget.value)}
              />
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <div class="flex justify-end">
        <Button.Root
          class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          onClick={handleExport}
        >
          {exporting() ? "Generating..." : "Generate Export"}
        </Button.Root>
      </div>
    </div>
  )
}
