import type { JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as NavigationMenu from "@solidiom/navigation-menu"

const NAV_ITEMS = [
  { label: "Users", href: "/" },
  { label: "Roles", href: "/roles" },
  { label: "Sessions", href: "/sessions" },
]

export function AppShell(props: { children: JSX.Element }): JSX.Element {
  const location = useLocation()

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-8">
            <A href="/" class="text-lg font-bold text-gray-900">
              Identity
            </A>
            <NavigationMenu.Root aria-label="Main navigation">
              <NavigationMenu.List class="flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <li role="none">
                    <NavigationMenu.Link
                      href={item.href}
                      active={location.pathname === item.href}
                      class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </NavigationMenu.Link>
                  </li>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
              I
            </span>
          </div>
        </div>
      </header>
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{props.children}</main>
    </div>
  )
}
