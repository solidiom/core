import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <section>
      <h2 class="text-xl font-medium">Welcome</h2>
      <p class="mt-2 text-sm text-neutral-600">
        This is a Solidiom starter scaffolded with TanStack Start (Solid), with server-side
        rendering enabled. Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </section>
  )
}
