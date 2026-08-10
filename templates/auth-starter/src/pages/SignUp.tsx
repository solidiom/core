import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import { AuthCard } from "../components/AuthCard"
import { FormField } from "../components/FormField"

export function SignUp(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md px-4">
        <AuthCard title="Create account" subtitle="Start your 30-day free trial. No credit card required.">
          <div class="space-y-4">
            <FormField label="Full name" placeholder="Jane Doe" />
            <FormField label="Email" type="email" placeholder="you@example.com" />
            <FormField label="Password" type="password" placeholder="At least 8 characters" />
            <FormField label="Confirm password" type="password" placeholder="••••••••" />
            <Button.Root class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Create account
            </Button.Root>
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
