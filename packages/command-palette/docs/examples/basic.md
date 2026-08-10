---
contentSchemaVersion: 1
title: Command Palette - Basic usage
description: Basic command palette example demonstrating core behavior.
keywords: [command-palette, basic, example]
locale: en
maturity: draft
product: Command Palette
productLayer: primitive
status: draft
package: "@solidiom/command-palette"
primitive: command-palette
section: examples
exampleId: command-palette-basic
source:
  path: packages/command-palette/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as CommandPalette from "@solidiom/command-palette"

;<CommandPalette.Root defaultOpen={true} onOpenChange={(open) => console.log(open)}>
  <CommandPalette.Input placeholder="Type a command..." />

  <CommandPalette.List>
    <CommandPalette.Group heading="Suggestions">
      <CommandPalette.Item value="calendar" onSelect={() => console.log("Calendar")}>
        Calendar
      </CommandPalette.Item>
      <CommandPalette.Item value="search" onSelect={() => console.log("Search")}>
        Search
      </CommandPalette.Item>
    </CommandPalette.Group>

    <CommandPalette.Group heading="Settings">
      <CommandPalette.Item value="profile" onSelect={() => console.log("Profile")}>
        Profile
      </CommandPalette.Item>
      <CommandPalette.Item value="settings" onSelect={() => console.log("Settings")}>
        Settings
      </CommandPalette.Item>
    </CommandPalette.Group>

    <CommandPalette.Empty>No results found.</CommandPalette.Empty>
  </CommandPalette.List>
</CommandPalette.Root>
```

The command palette provides keyboard navigation with arrow keys and Enter to select. The Empty part renders when no items match the current filter.
