---
contentSchemaVersion: 1
title: Avatar básico
description: Componente avatar con ejemplos de imagen y respaldo.
keywords: [avatar, image, user, component, primitive]
locale: es
maturity: draft
product: Avatar
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "avatar"
section: examples
exampleId: avatar-component-basic
source:
  path: apps/site/src/components/AvatarExample.tsx
  export: AvatarExample
  language: tsx
runnable: true
translationSourceHash: "3c97dbfdf01412de7df9969e5144a48e345fa14a8a724e1e291f201323ef0233"
translationStatus: draft
---

El componente Avatar es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/avatar`. Proporciona una visualización circular de imagen con respaldo automático cuando la imagen no se carga.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/avatar.jpg" alt="Jane Doe" fallback="JD" />
```

## Solo con respaldo

Renderiza un avatar de respaldo sin una fuente de imagen.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar fallback="JD">JD</StyledAvatar>
```

## Con contenido de respaldo personalizado

Proporciona contenido personalizado como la visualización de respaldo.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/avatar.jpg" alt="Jane Doe">
  <span>JD</span>
</StyledAvatar>
```