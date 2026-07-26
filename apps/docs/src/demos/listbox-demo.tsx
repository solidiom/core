import * as Listbox from "@solidiom/listbox"

export function ListboxDemo() {
  return (
    <Listbox.Root selectionMode="single" onValueChange={(v) => console.log("Selected:", v)}>
      <div class="w-[200px] rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1">
        <Listbox.Item value="red">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Red
          </span>
        </Listbox.Item>
        <Listbox.Item value="green">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Green
          </span>
        </Listbox.Item>
        <Listbox.Item value="blue">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Blue
          </span>
        </Listbox.Item>
        <Listbox.Item value="yellow">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Yellow
          </span>
        </Listbox.Item>
        <Listbox.Item value="purple">
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Purple
          </span>
        </Listbox.Item>
      </div>
    </Listbox.Root>
  )
}

export const listboxDemoCode = `import * as Listbox from "@solidiom/listbox"

function ListboxExample() {
  return (
    <Listbox.Root selectionMode="single">
      <Listbox.Item value="red">Red</Listbox.Item>
      <Listbox.Item value="green">Green</Listbox.Item>
      <Listbox.Item value="blue">Blue</Listbox.Item>
      <Listbox.Item value="yellow">Yellow</Listbox.Item>
      <Listbox.Item value="purple">Purple</Listbox.Item>
    </Listbox.Root>
  )
}`
