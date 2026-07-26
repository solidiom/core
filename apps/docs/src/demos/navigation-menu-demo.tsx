import * as NavigationMenu from "@solidiom/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu.Root aria-label="Main navigation" class="relative">
      <NavigationMenu.List class="flex items-center gap-1 rounded-lg bg-zinc-100 p-1">
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger class="rounded-md px-3 py-2 text-sm font-medium hover:bg-white data-[state=open]:bg-white transition-colors">
            Products
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="absolute top-full left-0 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
            <NavigationMenu.Link
              href="#widgets"
              class="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100"
            >
              Widgets
            </NavigationMenu.Link>
            <NavigationMenu.Link
              href="#gadgets"
              class="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100"
            >
              Gadgets
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="docs">
          <NavigationMenu.Trigger class="rounded-md px-3 py-2 text-sm font-medium hover:bg-white data-[state=open]:bg-white transition-colors">
            Documentation
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="absolute top-full left-0 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
            <NavigationMenu.Link
              href="#guides"
              class="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100"
            >
              Guides
            </NavigationMenu.Link>
            <NavigationMenu.Link
              href="#api"
              class="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100"
            >
              API Reference
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

export const navigationMenuDemoCode = `import * as NavigationMenu from "@solidiom/navigation-menu"

function NavigationMenuExample() {
  return (
    <NavigationMenu.Root aria-label="Main">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/widgets">Widgets</NavigationMenu.Link>
            <NavigationMenu.Link href="/gadgets">Gadgets</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
`
