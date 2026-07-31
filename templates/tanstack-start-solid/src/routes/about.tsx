import { createFileRoute } from "@tanstack/solid-router"
import { Root as Button } from "@solidiom/button"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <section>
      <h2 class="text-xl font-medium">About</h2>
      <p class="mt-2 text-sm text-neutral-600">
        This page demonstrates a Solidiom primitive (<code>@solidiom/button</code>) rendered with
        the Tailwind recipe profile.
      </p>
      <Button
        class="solidiom-btn--default solidiom-btn--md mt-4"
        onClick={() => alert("Hello from Solidiom!")}
      >
        Click me
      </Button>
    </section>
  )
}
