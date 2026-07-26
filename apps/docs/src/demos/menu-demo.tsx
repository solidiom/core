import * as Menu from "@solidiom/menu"

export function MenuDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <span class="inline-flex items-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
          Open Menu
        </span>
      </Menu.Trigger>
      <Menu.Content class="z-50 min-w-[160px] overflow-hidden rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1 shadow-md">
        <Menu.Item onSelect={() => console.log("Edit")}>
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Edit
          </span>
        </Menu.Item>
        <Menu.Item onSelect={() => console.log("Copy")}>
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Copy
          </span>
        </Menu.Item>
        <Menu.Item onSelect={() => console.log("Paste")}>
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Paste
          </span>
        </Menu.Item>
        <Menu.Separator class="my-1 h-px bg-[hsl(var(--border))]" />
        <Menu.Item onSelect={() => console.log("Delete")}>
          <span class="block w-full rounded-sm px-2 py-1.5 text-sm text-[hsl(var(--destructive,0_72%_51%))] hover:bg-[hsl(var(--accent))] cursor-pointer">
            Delete
          </span>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const menuDemoCode = `import * as Menu from "@solidiom/menu"

function MenuExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => console.log("Edit")}>Edit</Menu.Item>
        <Menu.Item onSelect={() => console.log("Copy")}>Copy</Menu.Item>
        <Menu.Item onSelect={() => console.log("Paste")}>Paste</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => console.log("Delete")}>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}`
