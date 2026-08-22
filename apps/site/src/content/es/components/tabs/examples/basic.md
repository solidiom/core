---
contentSchemaVersion: 1
title: Basic tabs
description: Tabs component with horizontal and vertical orientation examples.
keywords: [tabs, navigation, content, switch, primitive]
locale: es
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
translationSourceHash: "0a212c81402cf7677bd551daa985edb5195c6be56412d7fad55ed1fef320bad2"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Tabs es un wrapper de receta con estilos sobre el primitivo `@solidiom/tabs`. Proporciona selección de pestañas con navegación por teclado, foco itinerante, modos de activación automática y manual, y orientación horizontal y vertical.

```tsx
import { StyledTabs } from "@solidiom/recipes-css"
import * as Tabs from "@solidiom/tabs"

;<StyledTabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account settings content</Tabs.Content>
  <Tabs.Content value="password">Password settings content</Tabs.Content>
</StyledTabs>
```

## Orientación vertical

Usa la orientación vertical para diseños lado a lado donde las pestañas actúan como un panel de navegación.

```tsx
import { StyledTabs } from "@solidiom/recipes-css"
import * as Tabs from "@solidiom/tabs"

;<StyledTabs defaultValue="files" orientation="vertical">
  <Tabs.List>
    <Tabs.Trigger value="files">Files</Tabs.Trigger>
    <Tabs.Trigger value="folders">Folders</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="files">Files panel content</Tabs.Content>
  <Tabs.Content value="folders">Folders panel content</Tabs.Content>
</StyledTabs>
```
