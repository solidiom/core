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

export function MobileSidebar(props: { onClose: () => void }) {
  const location = useLocation()

  return (
    <div class="fixed inset-0 top-14 z-50 bg-[hsl(var(--background))] overflow-y-auto md:hidden">
      <div class="p-6">
        <div class="mb-4">
          <h4 class="mb-1 text-sm font-semibold">Getting Started</h4>
          <nav class="grid gap-1">
            <MobileLink
              href="/"
              label="Introduction"
              active={location.pathname === "/"}
              onClose={props.onClose}
            />
            <MobileLink
              href="/performance"
              label="Performance"
              active={location.pathname === "/performance"}
              onClose={props.onClose}
            />
          </nav>
        </div>

        <For each={categories}>
          {(category) => {
            const items = primitives.filter((p) => p.category === category)
            return (
              <div class="mb-4">
                <h4 class="mb-1 text-sm font-semibold">{categoryLabels[category]}</h4>
                <nav class="grid gap-1">
                  <For each={items}>
                    {(item) => (
                      <MobileLink
                        href={`/primitives/${item.name}`}
                        label={item.label}
                        active={location.pathname === `/primitives/${item.name}`}
                        onClose={props.onClose}
                      />
                    )}
                  </For>
                </nav>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}

function MobileLink(props: { href: string; label: string; active: boolean; onClose: () => void }) {
  return (
    <A
      href={props.href}
      onClick={props.onClose}
      class={`rounded-md px-2 py-1.5 text-sm transition-colors ${
        props.active
          ? "bg-[hsl(var(--accent))] font-medium text-[hsl(var(--accent-foreground))]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
      }`}
    >
      {props.label}
    </A>
  )
}
