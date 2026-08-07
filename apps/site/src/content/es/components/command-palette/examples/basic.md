---
contentSchemaVersion: 1
title: Basic command palette
description: Command palette component with modal command interface.
keywords: [command-palette, command, search, modal, primitive]
locale: es
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
translationSourceHash: "e4354d697f9c36ae3b10883cfbf6a4313d2d1c261d1e1d17b2447247809557dd"
translationStatus: draft
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
