import type { JSX } from "solid-js"

export function EventStream(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Event Stream</h1>
      <p>Audit Log — real-time stream of audit events with actor, action, and resource details.</p>
    </main>
  )
}
