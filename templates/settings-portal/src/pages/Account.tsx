import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import { SettingGroup } from "../components/SettingGroup"

const NAV_ITEMS = [
  { label: "Account", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Danger Zone", href: "/danger-zone" },
]

export function Account(): JSX.Element {
  const location = useLocation()
  const [name] = createSignal("Jane Cooper")
  const [email] = createSignal("jane.cooper@example.com")

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <A href="/" class="text-lg font-bold text-gray-900">Settings</A>
          <nav class="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <A
                href={item.href}
                class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </A>
            ))}
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="space-y-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p class="mt-1 text-sm text-gray-500">Manage your profile, email, and password.</p>
          </div>

          <Alert.Root type="success" class="rounded-md border border-green-200 bg-green-50 p-4">
            <Alert.Title class="text-sm font-medium text-green-800">Profile Updated</Alert.Title>
            <Alert.Description class="mt-1 text-sm text-green-700">
              Your profile information has been saved successfully.
            </Alert.Description>
          </Alert.Root>

          <SettingGroup title="Profile Information" description="Update your name and contact details.">
            <div class="space-y-4">
              <Field.Root>
                <Field.Label class="block text-sm font-medium text-gray-700">Full Name</Field.Label>
                <Input.Root value={name()} class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </Field.Root>

              <Field.Root>
                <Field.Label class="block text-sm font-medium text-gray-700">Email Address</Field.Label>
                <Input.Root value={email()} type="email" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <Field.Description class="mt-1 text-xs text-gray-500">We will send a verification email to your new address.</Field.Description>
              </Field.Root>
            </div>
          </SettingGroup>

          <SettingGroup title="Password" description="Change your password to keep your account secure.">
            <Card.Root class="rounded-lg border border-gray-200 bg-white">
              <Card.Content class="px-4 py-4">
                <div class="space-y-4">
                  <Field.Root>
                    <Field.Label class="block text-sm font-medium text-gray-700">Current Password</Field.Label>
                    <Input.Root type="password" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label class="block text-sm font-medium text-gray-700">New Password</Field.Label>
                    <Input.Root type="password" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label class="block text-sm font-medium text-gray-700">Confirm New Password</Field.Label>
                    <Input.Root type="password" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </Field.Root>
                </div>
              </Card.Content>
            </Card.Root>
          </SettingGroup>

          <div class="flex justify-end gap-3">
            <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Cancel
            </Button.Root>
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Save Changes
            </Button.Root>
          </div>
        </div>
      </main>
    </div>
  )
}
