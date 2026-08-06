---
contentSchemaVersion: 1
title: Basic command palette
description: Command palette component with modal command interface.
keywords: [command-palette, command, search, modal, primitive]
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

The Command Palette component is a styled recipe wrapper around the `@solidiom/command-palette` primitive. It provides a modal interface for quick command access.

```tsx
import { StyledCommandPalette, CommandPalette } from "@solidiom/recipes-css"

;<StyledCommandPalette>
  <CommandPalette.Input placeholder="Type a command..." />
  <CommandPalette.List>
    <CommandPalette.Group heading="Actions">
      <CommandPalette.Item value="new-file">New File</CommandPalette.Item>
      <CommandPalette.Item value="save">Save</CommandPalette.Item>
    </CommandPalette.Group>
  </CommandPalette.List>
</StyledCommandPalette>
```
