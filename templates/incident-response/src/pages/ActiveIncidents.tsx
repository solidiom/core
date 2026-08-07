import type { JSX } from "solid-js"

export function ActiveIncidents(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Active Incidents</h1>
      <p>Incident Response — track active incidents with severity, responders, and timeline updates.</p>
    </main>
  )
}
