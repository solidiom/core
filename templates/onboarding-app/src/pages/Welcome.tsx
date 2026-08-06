import type { JSX } from "solid-js"

export function Welcome(): JSX.Element {
  return (
    <main class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-lg p-6">
        <h1 class="text-2xl font-bold mb-6">Welcome</h1>
        <p>Onboarding app — welcome wizard step.</p>
      </div>
    </main>
  )
}
