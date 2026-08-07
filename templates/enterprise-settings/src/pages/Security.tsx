import type { JSX } from "solid-js"

export function Security(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Security Settings</h1>
      <p>Enterprise Settings — configure SSO, MFA enforcement, session policies, and IP allowlists.</p>
    </main>
  )
}
