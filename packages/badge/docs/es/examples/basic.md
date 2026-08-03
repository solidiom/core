---
contentSchemaVersion: 1
title: Badge básico
description: Ejemplos de uso básico de badge.
keywords: [badge, etiqueta, estado, indicador, inline]
locale: es
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: examples
exampleId: badge-basic
source:
  path: packages/badge/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "5ab83c25f202326e09ee8370e6be1a791ebd983678029167d66cb8954c8723e8"
translationStatus: draft
---

```tsx
import * as Badge from "@solidiom/badge"

;<Badge.Root>v1.0</Badge.Root>
```

## En Contexto

Usa badges en línea con texto para indicar estado, versión o etiquetas.

```tsx
;<div>
  <span>Lanzamiento</span>
  <Badge.Root>v2.0</Badge.Root>
</div>
```

## Múltiples Badges

Coloca varios badges juntos para mostrar estado compuesto o etiquetas.

```tsx
;<div style={{ display: "flex", gap: "4px" }}>
  <Badge.Root>nuevo</Badge.Root>
  <Badge.Root>destacado</Badge.Root>
</div>
```
