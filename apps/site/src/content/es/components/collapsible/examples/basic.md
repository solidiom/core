---
contentSchemaVersion: 1
title: "Collapsible – Ejemplo Básico"
description: "Un ejemplo básico del componente Collapsible que alterna la visibilidad del contenido."
keywords: ["collapsible", "acordeón", "alternar", "expandir", "colapsar"]
locale: es
maturity: draft
product: Collapsible
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "collapsible"
section: examples
exampleId: collapsible-component-basic
source: "@site/components/CollapsibleExample.tsx"
runnable: true
translationSourceHash: "b9a60f37d61cfb13fb9690db3703f5d46eb1a1615300fa39933a8c4caa191afe"
translationStatus: draft
---

El componente Collapsible gestiona una sección de contenido que puede alternarse entre estados visibles y ocultos.

```tsx
import { StyledCollapsible, Collapsible } from "@solidiom/recipes-css"

;<Collapsible.Root>
  <Collapsible.Trigger>Mostrar detalles</Collapsible.Trigger>
  <Collapsible.Content>Contenido colapsable aquí.</Collapsible.Content>
</Collapsible.Root>
```
