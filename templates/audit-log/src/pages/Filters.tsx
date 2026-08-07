import type { JSX } from "solid-js"

export function Filters(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Filters</h1>
      <p>Audit Log — advanced filters by actor, action type, resource, date range, and severity.</p>
    </main>
  )
}
