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
translationSourceHash: "78f91dc9d10ef335449a16ab4f8c5de5bdf957afdfc9b77a68d94984bfe3393c"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
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
