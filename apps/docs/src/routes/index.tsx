import { A } from "@solidjs/router"
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

export default function Home() {
  return (
    <div class="space-y-8">
      {/* Hero */}
      <div class="space-y-4">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Build your component library</h1>
        <p class="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed">
          Headless, accessible UI primitives for Solid 2. Unstyled by default — compose with your
          own design system and ship production-ready interfaces.
        </p>
      </div>

      {/* Quick links */}
      <div class="flex flex-wrap gap-2">
        <A
          href="/primitives/dialog"
          class="inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
        >
          Browse Components
        </A>
        <A
          href="/performance"
          class="inline-flex items-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
        >
          Performance Dashboard
        </A>
        <A
          href="/accessibility"
          class="inline-flex items-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
        >
          Accessibility
        </A>
      </div>

      {/* Component grid */}
      <div class="space-y-8 pt-4">
        <For each={categories}>
          {(category) => {
            const items = primitives.filter((p) => p.category === category)
            return (
              <section>
                <h2 class="mb-3 text-lg font-semibold tracking-tight">
                  {categoryLabels[category]}
                </h2>
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <For each={items}>{(item) => <ComponentCard item={item} />}</For>
                </div>
              </section>
            )
          }}
        </For>
      </div>
    </div>
  )
}

function ComponentCard(props: { item: PrimitiveEntry }) {
  return (
    <A
      href={`/primitives/${props.item.name}`}
      class="group rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-colors hover:bg-[hsl(var(--accent))]"
    >
      <h3 class="font-medium text-[hsl(var(--card-foreground))] group-hover:text-[hsl(var(--accent-foreground))]">
        {props.item.label}
      </h3>
      <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{props.item.description}</p>
    </A>
  )
}
