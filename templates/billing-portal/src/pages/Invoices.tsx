import type { JSX } from "solid-js"

export function Invoices(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Invoice History</h1>
      <p>Billing portal — paginated invoice list with download and filtering.</p>
    </main>
  )
}
