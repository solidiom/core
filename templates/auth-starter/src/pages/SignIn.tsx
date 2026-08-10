import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import { AuthCard } from "../components/AuthCard"
import { FormField } from "../components/FormField"

export function SignIn(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md px-4">
        <AuthCard title="Sign in" subtitle="Enter your credentials to access your account.">
          <div class="space-y-4">
            <FormField label="Email" type="email" placeholder="you@example.com" />
            <FormField label="Password" type="password" placeholder="••••••••" />
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span class="text-sm text-gray-600">Remember me</span>
              </label>
              <A href="/reset-password" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </A>
            </div>
            <Button.Root class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Sign in
            </Button.Root>
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
