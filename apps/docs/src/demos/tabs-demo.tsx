import * as Tabs from "@solidiom/tabs"

export function TabsDemo() {
  return (
    <div class="w-full max-w-md">
      <Tabs.Root defaultValue="account">
        <Tabs.List>
          <div class="flex border-b border-[hsl(var(--border))]">
            <Tabs.Trigger value="account">
              <span class="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                Account
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger value="password">
              <span class="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                Password
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">
              <span class="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                Settings
              </span>
            </Tabs.Trigger>
          </div>
        </Tabs.List>

        <Tabs.Content value="account">
          <div class="p-4 text-sm text-[hsl(var(--foreground))]">
            <h3 class="font-medium">Account</h3>
            <p class="mt-1 text-[hsl(var(--muted-foreground))]">
              Make changes to your account here. Click save when you're done.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="password">
          <div class="p-4 text-sm text-[hsl(var(--foreground))]">
            <h3 class="font-medium">Password</h3>
            <p class="mt-1 text-[hsl(var(--muted-foreground))]">
              Change your password here. After saving, you'll be logged out.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div class="p-4 text-sm text-[hsl(var(--foreground))]">
            <h3 class="font-medium">Settings</h3>
            <p class="mt-1 text-[hsl(var(--muted-foreground))]">
              Manage your notification and display preferences.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export const tabsDemoCode = `import * as Tabs from "@solidiom/tabs"

function TabsExample() {
  return (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account settings...</Tabs.Content>
      <Tabs.Content value="password">Password settings...</Tabs.Content>
      <Tabs.Content value="settings">General settings...</Tabs.Content>
    </Tabs.Root>
  )
}`
