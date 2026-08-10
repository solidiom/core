import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
}

export function SavedSearches(): JSX.Element {
  const [savedSearches, setSavedSearches] = createSignal([
    { id: 1, name: "Solid.js Updates", query: "solidjs framework", lastRun: "2 hours ago", resultCount: 42, active: true },
    { id: 2, name: "TypeScript Tips", query: "typescript advanced patterns", lastRun: "1 day ago", resultCount: 18, active: true },
    { id: 3, name: "Tailwind v4", query: "tailwindcss v4 migration", lastRun: "3 days ago", resultCount: 0, active: false },
  ])

  const deleteSearch = (id: number) => {
    setSavedSearches(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">Search</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/saved" current class="text-sm font-medium text-gray-900">Saved Searches</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Saved Searches</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your saved search queries and alert subscriptions.</p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Saved Searches</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          You have {savedSearches().length} saved searches. Click "Run" to re-execute or "Delete" to remove.
        </Alert.Description>
      </Alert.Root>

      <div class="space-y-4">
        {savedSearches().map((saved) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Content class="px-4 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium text-gray-900">{saved.name}</p>
                    <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[saved.active ? "active" : "paused"]}`}>
                      {saved.active ? "active" : "paused"}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">Query: {saved.query}</p>
                  <p class="mt-0.5 text-xs text-gray-400">Last run: {saved.lastRun} • {saved.resultCount} results</p>
                </div>
                <div class="flex gap-2">
                  <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Run
                  </Button.Root>
                  <Button.Root
                    onClick={() => deleteSearch(saved.id)}
                    class="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                  >
                    Delete
                  </Button.Root>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <div class="flex justify-end gap-3">
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Import
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          New Saved Search
        </Button.Root>
      </div>
    </div>
  )
}
