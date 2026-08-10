import type { JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Alert from "@solidiom/alert"
import { SettingGroup } from "../components/SettingGroup"
import { DangerZoneItem } from "../components/DangerZone"

const NAV_ITEMS = [
  { label: "Account", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Danger Zone", href: "/danger-zone" },
]

export function DangerZone(): JSX.Element {
  const location = useLocation()

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
            <h1 class="text-2xl font-bold text-gray-900">Danger Zone</h1>
            <p class="mt-1 text-sm text-gray-500">Irreversible and destructive actions.</p>
          </div>

          <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
            <Alert.Title class="text-sm font-medium text-red-800">Warning</Alert.Title>
            <Alert.Description class="mt-1 text-sm text-red-700">
              The actions below are irreversible. Proceed with extreme caution.
            </Alert.Description>
          </Alert.Root>

          <SettingGroup title="Destructive Actions" description="These actions cannot be undone.">
            <div class="space-y-4">
              <DangerZoneItem
                title="Delete Account"
                description="Permanently delete your account and all of your data."
                actionLabel="Delete Account"
                onConfirm={() => alert("Account deletion confirmed")}
              />
              <DangerZoneItem
                title="Transfer Ownership"
                description="Transfer account ownership to another user."
                actionLabel="Transfer Ownership"
                onConfirm={() => alert("Ownership transfer initiated")}
              />
              <DangerZoneItem
                title="Cancel Subscription"
                description="Cancel your subscription at the end of the current billing period."
                actionLabel="Cancel Subscription"
                onConfirm={() => alert("Subscription cancellation confirmed")}
              />
            </div>
          </SettingGroup>
        </div>
      </main>
    </div>
  )
}
