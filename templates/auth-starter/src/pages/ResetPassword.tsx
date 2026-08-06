import type { JSX } from "solid-js"

export function ResetPassword(): JSX.Element {
  return (
    <main class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-md p-6">
        <h1 class="text-2xl font-bold mb-6">Reset Password</h1>
        <p>Authentication starter — password reset page.</p>
      </div>
    </main>
  )
}
