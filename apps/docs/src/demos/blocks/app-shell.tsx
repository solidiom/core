/**
 * App Shell block — a responsive layout with sidebar, header, and main content.
 *
 * Copy-paste template using CSS Grid. No primitive dependency.
 */

import { createSignal } from "solid-js"
import { type JSX } from "@solidjs/web"

export function AppShellBlock() {
  const [sidebarOpen, setSidebarOpen] = createSignal(true)

  return (
    <div class="grid h-[400px] w-full overflow-hidden rounded-lg border border-zinc-200 grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
      {/* Header */}
      <header class="col-span-2 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3">
        <button
          type="button"
          class="rounded-md p-1.5 hover:bg-zinc-100"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-sm font-semibold">App Shell</span>
      </header>

      {/* Sidebar */}
      <aside
        class="row-start-2 border-r border-zinc-200 bg-zinc-50 transition-all duration-200 overflow-hidden"
        style={{ width: sidebarOpen() ? "200px" : "0px" }}
      >
        <nav class="flex flex-col gap-1 p-3">
          <a href="#" class="rounded-md px-3 py-2 text-sm font-medium bg-zinc-200">
            Dashboard
          </a>
          <a href="#" class="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
            Settings
          </a>
          <a href="#" class="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
            Users
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main class="row-start-2 overflow-auto p-6">
        <h2 class="text-lg font-semibold mb-3">Main Content</h2>
        <p class="text-sm text-zinc-600">
          This is the main content area. The sidebar collapses on toggle.
        </p>
      </main>
    </div>
  )
}

export const appShellBlockCode = `// App Shell — responsive layout with sidebar, header, and main content.
// Pure CSS Grid composition. Copy and adapt for your project.

function AppShell(props: { children: JSX.Element }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(true)

  return (
    <div class="grid h-screen grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
      <header class="col-span-2 border-b px-4 py-3">
        <button onClick={() => setSidebarOpen(v => !v)}>Toggle</button>
      </header>
      <aside style={{ width: sidebarOpen() ? "240px" : "0" }}>
        {/* Navigation links */}
      </aside>
      <main class="overflow-auto p-6">{props.children}</main>
    </div>
  )
}
`
