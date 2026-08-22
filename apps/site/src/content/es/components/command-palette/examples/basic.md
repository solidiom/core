---
contentSchemaVersion: 1
title: Basic command palette
description: Command palette component with searchable command list and keyboard navigation.
keywords: [command-palette, command, search, keyboard, navigation, primitive]
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
translationSourceHash: "c77df4fb9b351d0646e95a954bbf080c2e965b3de63726319b62e5e5f9bd3cbf"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Command Palette proporciona una lista de comandos buscable con navegación por teclado.

```tsx
import { StyledCommandPalette } from "@solidiom/recipes-css"
import * as CommandPalette from "@solidiom/command-palette"

;<CommandPalette.Root>
  <CommandPalette.Input placeholder="Escriba un comando..." />
  <CommandPalette.List>
    <CommandPalette.Group heading="Acciones">
      <CommandPalette.Item value="save">Guardar</CommandPalette.Item>
      <CommandPalette.Item value="undo">Deshacer</CommandPalette.Item>
    </CommandPalette.Group>
  </CommandPalette.List>
</CommandPalette.Root>
```
