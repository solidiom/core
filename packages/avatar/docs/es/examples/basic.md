---
contentSchemaVersion: 1
title: Avatar básico
description: Ejemplos de avatar con imagen y reemplazo de texto.
keywords: [avatar, imagen, reemplazo, iniciales, usuario]
locale: es
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: examples
exampleId: avatar-basic
source:
  path: packages/avatar/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "f2e690ca150774a5ddc3d1091e58d90cfc42be24b691c5e15694e1ca2d13ae56"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

```tsx
import * as Avatar from "@solidiom/avatar"

;<Avatar.Root>
  <Avatar.Image src="/avatars/ana-garcia.jpg" alt="Foto de Ana García" />
  <Avatar.Fallback>AG</Avatar.Fallback>
</Avatar.Root>
```

## Con reemplazo de nombre completo

Usa el nombre del usuario como contenido de reemplazo para una mejor identificación cuando la imagen no está disponible.

```tsx
;<Avatar.Root>
  <Avatar.Image src="/avatars/ana-garcia.jpg" alt="Foto de Ana García" />
  <Avatar.Fallback>Ana García</Avatar.Fallback>
</Avatar.Root>
```

## Avatares apilados

Combina múltiples avatares en un grupo para mostrar equipos o hilos de comentarios.

```tsx
;<div style={{ display: "flex", gap: "8px" }}>
  <Avatar.Root>
    <Avatar.Image src="/users/1.jpg" alt="Usuario 1" />
    <Avatar.Fallback>A</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/users/2.jpg" alt="Usuario 2" />
    <Avatar.Fallback>B</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/users/3.jpg" alt="Usuario 3" />
    <Avatar.Fallback>C</Avatar.Fallback>
  </Avatar.Root>
</div>
```
