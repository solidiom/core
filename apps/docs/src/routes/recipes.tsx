import { For } from "solid-js"
import { ComponentPreview } from "../components/component-preview"
import { recipeDemos } from "../demos/recipes"

export default function RecipesPage() {
  const entries = Object.entries(recipeDemos)

  return (
    <div class="space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Recipes</h1>
        <p class="text-lg text-[hsl(var(--muted-foreground))]">
          Pre-styled component wrappers powered by{" "}
          <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
            @solidiom/recipes-tailwind
          </code>
          . Import the recipe + its stylesheet for copy-paste-ready styled components.
        </p>
      </div>

      <For each={entries}>
        {([name, entry]) => (
          <section class="space-y-3">
            <h2 class="text-xl font-semibold tracking-tight">{entry.label}</h2>
            <ComponentPreview code={entry.code}>{entry.component()}</ComponentPreview>
          </section>
        )}
      </For>
    </div>
  )
}
