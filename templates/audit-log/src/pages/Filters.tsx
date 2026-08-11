import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"

const ACTORS = [
  "alice@example.com",
  "bob@example.com",
  "carol@example.com",
  "system",
  "eve@example.com",
]
const ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "CREATE_USER",
  "UPDATE_ROLE",
  "DELETE_RECORD",
  "EXPORT_DATA",
  "MODIFY_PERMISSION",
]
const SEVERITIES = ["info", "warning", "error", "success"]

export function Filters(): JSX.Element {
  const [actor, setActor] = createSignal("")
  const [action, setAction] = createSignal("")
  const [severity, setSeverity] = createSignal("")
  const [dateFrom, setDateFrom] = createSignal("2025-08-01")
  const [dateTo, setDateTo] = createSignal("2025-08-10")

  const matchCount = () => {
    let count = 1247
    if (actor()) count = Math.floor(count / 3)
    if (action()) count = Math.floor(count / 2)
    if (severity()) count = Math.floor(count / 3)
    return count
  }

  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/filters" current class="text-gray-900 font-medium">
                  Filters
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Advanced Filters</h1>
          <p class="mt-1 text-sm text-gray-500">
            Build complex queries to narrow down audit events by actor, action, severity, and date
            range.
          </p>
        </div>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Filter Builder</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {matchCount()} events match your current filter criteria. Adjust filters below to refine
          results.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
          <Card.Header class="border-b border-gray-100 px-6 py-4">
            <Card.Title class="text-base font-semibold text-gray-900">Actor Filter</Card.Title>
          </Card.Header>
          <Card.Content class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Actor</label>
              <select
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={actor()}
                onChange={(e) => setActor(e.currentTarget.value)}
              >
                <option value="">All actors</option>
                {ACTORS.map((a) => (
                  <option value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={action()}
                onChange={(e) => setAction(e.currentTarget.value)}
              >
                <option value="">All actions</option>
                {ACTIONS.map((a) => (
                  <option value={a}>{a}</option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
          <Card.Header class="border-b border-gray-100 px-6 py-4">
            <Card.Title class="text-base font-semibold text-gray-900">
              Severity & Date Range
            </Card.Title>
          </Card.Header>
          <Card.Content class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={severity()}
                onChange={(e) => setSeverity(e.currentTarget.value)}
              >
                <option value="">All severities</option>
                {SEVERITIES.map((s) => (
                  <option value={s}>{s}</option>
                ))}
              </select>
            </div>
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
      </div>

      <div class="flex justify-end gap-3">
        <Button.Root
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={() => {
            setActor("")
            setAction("")
            setSeverity("")
            setDateFrom("2025-08-01")
            setDateTo("2025-08-10")
          }}
        >
          Clear Filters
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Apply Filters
        </Button.Root>
      </div>
    </div>
  )
}
