import type { JSX } from "solid-js"

export function ProfileSetup(): JSX.Element {
  return (
    <main class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-lg p-6">
        <h1 class="text-2xl font-bold mb-6">Profile Setup</h1>
        <p>Onboarding app — profile configuration step.</p>
      </div>
    </main>
  )
}
