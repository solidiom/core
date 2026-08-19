import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import { AuthCard } from "../components/AuthCard"

export function ResetPassword(): JSX.Element {
  const [email, setEmail] = createSignal("")
  const [error, setError] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const [sent, setSent] = createSignal(false)
  const [resendCooldown, setResendCooldown] = createSignal(0)

  const isValid = () => email().includes("@") && email().length > 3

  const handleSubmit = () => {
    setError("")
    if (!isValid()) {
      setError("Please enter a valid email address.")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSent(true)
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1500)
  }

  const handleResend = () => {
    if (resendCooldown() > 0) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  if (sent()) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50">
        <div class="w-full max-w-md px-4">
          <AuthCard
            title="Check your email"
            subtitle="We've sent a password reset link to your email address."
          >
            <div class="flex flex-col items-center space-y-6 py-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div class="text-center space-y-2">
                <p class="text-sm text-gray-700">
                  We sent a reset link to <span class="font-medium text-gray-900">{email()}</span>
                </p>
                <p class="text-xs text-gray-500">
                  If you don't see it, check your spam folder or wait a few minutes.
                </p>
              </div>

              <div class="w-full space-y-4">
                <Alert.Root type="info">
                  <Alert.Description class="text-sm text-indigo-700">
                    The link will expire in 15 minutes. If you don't receive an email, make sure the
                    address is correct.
                  </Alert.Description>
                </Alert.Root>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown() > 0}
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendCooldown() > 0
                    ? `Resend in ${resendCooldown()}s`
                    : "Didn't receive the email? Resend"}
                </button>
              </div>
            </div>

            <p class="mt-4 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <A href="/" class="font-medium text-indigo-600 hover:text-indigo-500">
                Back to sign in
              </A>
            </p>
          </AuthCard>
        </div>
      </div>
    )
  }

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md px-4">
        <AuthCard title="Reset password" subtitle="We'll send you a link to reset your password.">
          <div class="space-y-4">
            <div class="rounded-md bg-blue-50 p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-blue-800">
                    Enter the email address associated with your account and we'll send you
                    instructions to reset your password.
                  </p>
                </div>
              </div>
            </div>

            {error() && (
              <Alert.Root type="error">
                <Alert.Description class="text-sm text-red-700">{error()}</Alert.Description>
              </Alert.Root>
            )}

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">
                Email address
              </Field.Label>
              <Input.Root
                type="email"
                placeholder="you@example.com"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                autocomplete="email"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Field.Description class="mt-1 text-xs text-gray-500">
                We'll only send a reset link if this email is registered.
              </Field.Description>
            </Field.Root>

            <Button.Root
              onClick={handleSubmit}
              disabled={isLoading()}
              class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading() ? "Sending..." : "Send reset link"}
            </Button.Root>
          </div>

          <p class="mt-4 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <A href="/" class="font-medium text-indigo-600 hover:text-indigo-500">
              Back to sign in
            </A>
          </p>
        </AuthCard>
      </div>
    </div>
  )
}
