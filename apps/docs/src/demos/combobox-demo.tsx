import { createSignal, For } from "solid-js"
import * as Combobox from "@solidiom/combobox"

const frameworks = ["React", "Solid", "Vue", "Svelte", "Angular"]

export function ComboboxDemo() {
  const [query, setQuery] = createSignal("")
  const filtered = () => frameworks.filter((f) => f.toLowerCase().includes(query().toLowerCase()))

  return (
    <Combobox.Root onValueChange={(v) => setQuery("")}>
      <Combobox.Input
        class="rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] min-w-[200px] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        placeholder="Search frameworks..."
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <Combobox.Content class="z-50 min-w-[200px] overflow-hidden rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1 shadow-md">
        <For
          each={filtered()}
          fallback={
            <span class="block px-2 py-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              No results found
            </span>
          }
        >
          {(framework) => (
            <Combobox.Item value={framework}>
              <Combobox.ItemText>
                <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
                  {framework}
                </span>
              </Combobox.ItemText>
            </Combobox.Item>
          )}
        </For>
      </Combobox.Content>
    </Combobox.Root>
  )
}

export const comboboxDemoCode = `import { createSignal, For } from "solid-js"
import * as Combobox from "@solidiom/combobox"

const frameworks = ["React", "Solid", "Vue", "Svelte", "Angular"]

function ComboboxExample() {
  const [query, setQuery] = createSignal("")
  const filtered = () =>
    frameworks.filter((f) => f.toLowerCase().includes(query().toLowerCase()))

  return (
    <Combobox.Root>
      <Combobox.Input
        placeholder="Search frameworks..."
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <Combobox.Content>
        <For each={filtered()}>
          {(framework) => (
            <Combobox.Item value={framework}>
              <Combobox.ItemText>{framework}</Combobox.ItemText>
            </Combobox.Item>
          )}
        </For>
      </Combobox.Content>
    </Combobox.Root>
  )
}`
