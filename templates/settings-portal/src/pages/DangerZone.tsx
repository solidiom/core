import type { JSX } from "solid-js"

export function DangerZone(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Danger Zone</h1>
      <p>Settings portal — destructive actions with confirmation dialogs.</p>
    </main>
  )
}
