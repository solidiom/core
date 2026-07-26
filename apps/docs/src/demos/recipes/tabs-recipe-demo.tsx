import { StyledTabs } from "@solidiom/recipes-tailwind"
import * as Tabs from "@solidiom/tabs"

export function TabsRecipeDemo() {
  return (
    <StyledTabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <p class="text-sm text-[hsl(var(--muted-foreground))]">
          Manage your account settings and preferences.
        </p>
      </Tabs.Content>
      <Tabs.Content value="password">
        <p class="text-sm text-[hsl(var(--muted-foreground))]">
          Update your password and security settings.
        </p>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <p class="text-sm text-[hsl(var(--muted-foreground))]">
          Configure notification preferences.
        </p>
      </Tabs.Content>
    </StyledTabs>
  )
}

export const tabsRecipeDemoCode = `import { StyledTabs } from "@solidiom/recipes-tailwind"
import * as Tabs from "@solidiom/tabs"
import "@solidiom/recipes-tailwind/styles/tabs.css"

function Example() {
  return (
    <StyledTabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account settings</Tabs.Content>
      <Tabs.Content value="password">Password settings</Tabs.Content>
    </StyledTabs>
  )
}`
