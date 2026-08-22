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
package: "@solidiom/collapsible"
section: examples
exampleId: collapsible-component-basic
source:
  path: apps/site/src/components/CollapsibleExample.tsx
  export: CollapsibleExample
  language: tsx
runnable: true
translationSourceHash: "1e24075e3babc0772458978203e308240c30f2315301003201d906a671cefcdb"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Collapsible gestiona una sección de contenido que puede alternarse entre estados visibles y ocultos.

```tsx
import * as Collapsible from "@solidiom/collapsible"

;<Collapsible.Root>
  <Collapsible.Trigger>Mostrar detalles</Collapsible.Trigger>
  <Collapsible.Content>Contenido colapsable aquí.</Collapsible.Content>
</Collapsible.Root>
```
