import type { JSX } from "solid-js"
import { createSignal, createMemo } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import { AuthCard } from "../components/AuthCard"

export function SignUp(): JSX.Element {
  const [name, setName] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [agreedToTerms, setAgreedToTerms] = createSignal(false)
  const [error, setError] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const [success, setSuccess] = createSignal(false)

  const passwordStrength = createMemo(() => {
    const p = password()
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })

  const strengthLabel = () => {
    const s = passwordStrength()
    if (s === 0) return { label: "", color: "" }
    if (s <= 1) return { label: "Weak", color: "bg-red-500" }
    if (s <= 2) return { label: "Fair", color: "bg-orange-500" }
    if (s <= 3) return { label: "Good", color: "bg-yellow-500" }
    if (s <= 4) return { label: "Strong", color: "bg-green-500" }
    return { label: "Very strong", color: "bg-green-600" }
  }

  const passwordsMatch = () => password() === confirmPassword() && confirmPassword().length > 0

  const isValid = () =>
    name().trim().length > 0 &&
    email().includes("@") &&
    password().length >= 8 &&
    confirmPassword() === password() &&
    agreedToTerms()

  const handleSubmit = () => {
    setError("")
    if (!isValid()) {
      if (name().trim().length === 0) return setError("Please enter your full name.")
      if (!email().includes("@")) return setError("Please enter a valid email address.")
      if (password().length < 8) return setError("Password must be at least 8 characters.")
      if (password() !== confirmPassword()) return setError("Passwords do not match.")
      if (!agreedToTerms()) return setError("You must agree to the terms of service.")
      setError("Please fix the errors above.")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success()) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50">
        <div class="w-full max-w-md px-4">
          <AuthCard title="Account created" subtitle="You're all set! Check your email to verify your account.">
            <div class="flex flex-col items-center space-y-4 py-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p class="text-center text-sm text-gray-600">
                We've sent a verification email to{" "}
                <span class="font-medium text-gray-900">{email()}</span>
              </p>
              <A href="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Back to sign in
              </A>
            </div>
          </AuthCard>
        </div>
      </div>
    )
  }

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md px-4">
        <AuthCard title="Create account" subtitle="Start your 30-day free trial. No credit card required.">
          <div class="space-y-4">
            {error() && (
              <Alert.Root type="error">
                <Alert.Description class="text-sm text-red-700">{error()}</Alert.Description>
              </Alert.Root>
            )}

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Full name</Field.Label>
              <Input.Root
                type="text"
                placeholder="Jane Doe"
                value={name()}
                onInput={(e: Event) => setName((e.target as HTMLInputElement).value)}
                autocomplete="name"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Email address</Field.Label>
              <Input.Root
                type="email"
                placeholder="you@example.com"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                autocomplete="email"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Password</Field.Label>
              <Input.Root
                type="password"
                placeholder="At least 8 characters"
                value={password()}
                onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
                autocomplete="new-password"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {password().length > 0 && (
                <div class="mt-2 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Strength</span>
                    <span class="text-xs font-medium text-gray-700">{strengthLabel().label}</span>
                  </div>
                  <div class="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        class={`h-1.5 flex-1 rounded-full ${
                          i <= passwordStrength() ? strengthLabel().color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <ul class="mt-2 space-y-1 text-xs text-gray-500">
                <li class={password().length >= 8 ? "text-green-600" : ""}>
                  {password().length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li class={/[A-Z]/.test(password()) ? "text-green-600" : ""}>
                  {/[A-Z]/.test(password()) ? "✓" : "○"} One uppercase letter
                </li>
                <li class={/[0-9]/.test(password()) ? "text-green-600" : ""}>
                  {/[0-9]/.test(password()) ? "✓" : "○"} One number
                </li>
                <li class={/[^A-Za-z0-9]/.test(password()) ? "text-green-600" : ""}>
                  {/[^A-Za-z0-9]/.test(password()) ? "✓" : "○"} One special character
                </li>
              </ul>
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Confirm password</Field.Label>
              <Input.Root
                type="password"
                placeholder="••••••••"
                value={confirmPassword()}
                onInput={(e: Event) => setConfirmPassword((e.target as HTMLInputElement).value)}
                autocomplete="new-password"
                class={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  confirmPassword().length > 0
                    ? passwordsMatch()
                      ? "border-green-300"
                      : "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {confirmPassword().length > 0 && (
                <Field.Error
                  class={`mt-1 text-xs ${
                    passwordsMatch() ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch() ? "Passwords match" : "Passwords do not match"}
                </Field.Error>
              )}
            </Field.Root>

            <label class="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms()}
                onChange={() => setAgreedToTerms(!agreedToTerms())}
                class="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button.Root
              onClick={handleSubmit}
              disabled={isLoading()}
              class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading() ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <A href="/" class="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </A>
          </p>
        </AuthCard>
      </div>
    </div>
  )
}
