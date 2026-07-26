import { A, useLocation } from "@solidjs/router"
import { For } from "solid-js"
import { primitives, type PrimitiveEntry } from "../lib/primitives"

const categories = ["overlay", "input", "layout", "feedback", "navigation"] as const

const categoryLabels: Record<PrimitiveEntry["category"], string> = {
  overlay: "Overlay",
  input: "Input",
  layout: "Layout",
  feedback: "Feedback",
  navigation: "Navigation",
}

export function Sidebar() {
  const location = useLocation()

  return (
    <aside class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-[hsl(var(--border))] md:sticky md:block">
      <div class="py-6 pr-6 pl-4">
        <div class="mb-4">
          <h4 class="mb-1 px-2 text-sm font-semibold text-[hsl(var(--foreground))]">
            Getting Started
          </h4>
          <nav class="grid gap-1">
            <SidebarLink href="/" label="Introduction" active={location.pathname === "/"} />
            <SidebarLink
              href="/recipes"
              label="Recipes"
              active={location.pathname === "/recipes"}
            />
            <SidebarLink
              href="/performance"
              label="Performance"
              active={location.pathname === "/performance"}
            />
          </nav>
        </div>

        <For each={categories}>
          {(category) => {
            const items = primitives.filter((p) => p.category === category)
            return (
              <div class="mb-4">
                <h4 class="mb-1 px-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                  {categoryLabels[category]}
                </h4>
                <nav class="grid gap-1">
                  <For each={items}>
                    {(item) => (
                      <SidebarLink
                        href={`/primitives/${item.name}`}
                        label={item.label}
                        active={location.pathname === `/primitives/${item.name}`}
                      />
                    )}
                  </For>
                </nav>
              </div>
            )
          }}
        </For>
      </div>
    </aside>
  )
}

function SidebarLink(props: { href: string; label: string; active: boolean }) {
  return (
    <A
      href={props.href}
      class={`rounded-md px-2 py-1.5 text-sm transition-colors ${
        props.active
          ? "bg-[hsl(var(--accent))] font-medium text-[hsl(var(--accent-foreground))]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
      }`}
    >
      {props.label}
    </A>
  )
}
