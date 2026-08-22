---
contentSchemaVersion: 1
title: Skeleton
description: Primitiva de marcador de carga sin estilos.
keywords: [skeleton, loading, placeholder, primitive]
locale: es
maturity: beta
product: Skeleton
productLayer: component
status: published
package: "@solidiom/skeleton"
translationSourceHash: "477ad3d3bd6d4add4035b9489a5a7bf277cae63aed510a6929a850cc7c6b61e9"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El paquete `@solidiom/skeleton` exporta la primitiva `Skeleton.Root`. Los paquetes de recetas no exportan un envoltorio `StyledSkeleton`.

## Uso

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<div>
  <Skeleton.Root variant="circular" width="48" height="48" />
  <Skeleton.Root variant="text" width="200" />
  <Skeleton.Root variant="rectangular" width="200" height="80" />
</div>
```

`Skeleton.Root` acepta `variant` (`text`, `circular` o `rectangular`), `width`, `height`, `class` y `style`.

## Instalación

```sh
pnpm add @solidiom/skeleton
```

## Estilos y accesibilidad

La primitiva emite atributos `data-*` semánticos, acepta las propiedades `class` y `style`, y renderiza el marcador con `aria-hidden="true"`. Actualmente no se exporta una receta para esta primitiva.

Consulta el [contrato de accesibilidad de la primitiva Skeleton](/primitives/skeleton/accessibility/).
