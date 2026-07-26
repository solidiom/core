import * as Drawer from "@solidiom/drawer"

export function DrawerDemo() {
  return (
    <Drawer.Root side="right">
      <Drawer.Trigger>
        <span class="inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          Open Drawer
        </span>
      </Drawer.Trigger>
      <Drawer.Backdrop class="fixed inset-0 z-50 bg-black/80" />
      <Drawer.Content class="fixed right-0 top-0 z-50 h-full w-80 border-l border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-lg">
        <Drawer.Title>
          <span class="text-lg font-semibold">Navigation</span>
        </Drawer.Title>
        <Drawer.Description>
          <span class="mt-2 block text-sm text-[hsl(var(--muted-foreground))]">
            Browse sections of the application.
          </span>
        </Drawer.Description>
        <div class="mt-6">
          <Drawer.Close>
            <span class="inline-flex items-center rounded-md border border-[hsl(var(--input))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors">
              Close
            </span>
          </Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export const drawerDemoCode = `import * as Drawer from "@solidiom/drawer"

function DrawerExample() {
  return (
    <Drawer.Root side="right">
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Content>
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>Browse sections.</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  )
}`
