import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import { AuthCard } from "../components/AuthCard"

export function SignIn(): JSX.Element {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const [remember, setRemember] = createSignal(false)

  const isValid = () => email().includes("@") && password().length >= 8

  const handleSubmit = () => {
    setError("")
    if (!isValid()) {
      setError("Please enter a valid email and password (min 8 characters).")
      return
    }
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md px-4">
        <AuthCard title="Sign in" subtitle="Enter your credentials to access your account.">
          <div class="space-y-4">
            {error() && (
              <Alert.Root type="error">
                <Alert.Title class="text-sm font-medium text-red-800">
                  Invalid credentials
                </Alert.Title>
                <Alert.Description class="text-sm text-red-700">{error()}</Alert.Description>
              </Alert.Root>
            )}

            <Field.Root>
              <Field.Label>Email address</Field.Label>
              <Input.Root
                type="email"
                placeholder="you@example.com"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                autocomplete="email"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input.Root
                type="password"
                placeholder="••••••••"
                value={password()}
                onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
                autocomplete="current-password"
              />
            </Field.Root>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember()}
                  onChange={() => setRemember(!remember())}
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-600">Remember me</span>
              </label>
              <A
                href="/reset-password"
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </A>
            </div>

            <Button.Root
              onClick={handleSubmit}
              disabled={isLoading()}
              class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading() ? "Signing in..." : "Sign in"}
            </Button.Root>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-gray-50 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Button.Root
                variant="outline"
                class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                GitHub
              </Button.Root>
              <Button.Root
                variant="outline"
                class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Google
              </Button.Root>
            </div>
          </div>

          <p class="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <A href="/sign-up" class="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </A>
          </p>
        </AuthCard>
      </div>
    </div>
  )
}
