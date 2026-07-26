import * as Command from "@solidiom/command-palette"

export function CommandPaletteDemo() {
  return (
    <Command.Root
      defaultOpen={true}
      class="w-full max-w-md rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-lg overflow-hidden"
    >
      <Command.Input
        placeholder="Type a command or search..."
        class="w-full border-b border-[hsl(var(--border))] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
      />
      <Command.List class="max-h-64 overflow-auto p-2">
        <Command.Group heading="Suggestions" class="mb-2">
          <span class="px-2 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            Suggestions
          </span>
          <Command.Item
            value="calendar"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-[hsl(var(--accent))]"
          >
            📅 Calendar
          </Command.Item>
          <Command.Item
            value="search"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-[hsl(var(--accent))]"
          >
            🔍 Search
          </Command.Item>
          <Command.Item
            value="settings"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-[hsl(var(--accent))]"
          >
            ⚙️ Settings
          </Command.Item>
        </Command.Group>
        <Command.Empty class="px-2 py-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
          No results found.
        </Command.Empty>
      </Command.List>
    </Command.Root>
  )
}

export const commandPaletteDemoCode = `import * as Command from "@solidiom/command-palette"

function CommandPaletteExample() {
  return (
    <Command.Root>
      <Command.Input placeholder="Type a command..." />
      <Command.List>
        <Command.Group heading="Suggestions">
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="search">Search</Command.Item>
          <Command.Item value="settings">Settings</Command.Item>
        </Command.Group>
        <Command.Empty>No results found.</Command.Empty>
      </Command.List>
    </Command.Root>
  )
}`
