---
contentSchemaVersion: 1
title: Basic command palette
description: Command palette component with searchable command list and keyboard navigation.
keywords: [command-palette, command, search, keyboard, navigation, primitive]
locale: en
maturity: draft
product: Command Palette
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "command-palette"
section: examples
exampleId: command-palette-component-basic
source:
  path: apps/site/src/components/CommandPaletteExample.tsx
  export: CommandPaletteExample
  language: tsx
  runnable: true
---

The Command Palette component provides a searchable list of commands with keyboard navigation.

```tsx
import { StyledCommandPalette } from "@solidiom/recipes-css"
import * as CommandPalette from "@solidiom/command-palette"

;<CommandPalette.Root>
  <CommandPalette.Input placeholder="Type a command..." />
  <CommandPalette.List>
    <CommandPalette.Group heading="Actions">
      <CommandPalette.Item value="save">Save</CommandPalette.Item>
      <CommandPalette.Item value="undo">Undo</CommandPalette.Item>
    </CommandPalette.Group>
  </CommandPalette.List>
</CommandPalette.Root>
```
