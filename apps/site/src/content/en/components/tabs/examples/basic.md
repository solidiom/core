---
contentSchemaVersion: 1
title: Basic tabs
description: Tabs component with horizontal and vertical orientation examples.
keywords: [tabs, navigation, content, switch, primitive]
locale: en
maturity: draft
product: Tabs
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tabs"
section: examples
exampleId: tabs-component-basic
source:
  path: apps/site/src/components/TabsExample.tsx
  export: TabsExample
  language: tsx
runnable: true
---

The Tabs component is a styled recipe wrapper around the `@solidiom/tabs` primitive. It provides tab selection with keyboard navigation, roving focus, automatic and manual activation modes, and horizontal and vertical orientation.

```tsx
import { StyledTabs, Tabs } from "@solidiom/recipes-css"

;<StyledTabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account settings content</Tabs.Content>
  <Tabs.Content value="password">Password settings content</Tabs.Content>
</StyledTabs>
```

## Vertical orientation

Use vertical orientation for side-by-side layouts where tabs act as a navigation panel.

```tsx
import { StyledTabs, Tabs } from "@solidiom/recipes-css"

;<StyledTabs defaultValue="files" orientation="vertical">
  <Tabs.List>
    <Tabs.Trigger value="files">Files</Tabs.Trigger>
    <Tabs.Trigger value="folders">Folders</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="files">Files panel content</Tabs.Content>
  <Tabs.Content value="folders">Folders panel content</Tabs.Content>
</StyledTabs>
```
