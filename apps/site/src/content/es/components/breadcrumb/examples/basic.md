---
contentSchemaVersion: 1
title: Breadcrumb básico
description: Componente breadcrumb con ejemplos de jerarquía de navegación.
keywords: [breadcrumb, navigation, hierarchy, component]
locale: es
maturity: draft
product: Breadcrumb
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "breadcrumb"
section: examples
exampleId: breadcrumb-component-basic
source:
  path: apps/site/src/components/BreadcrumbExample.tsx
  export: BreadcrumbExample
  language: tsx
runnable: true
translationSourceHash: "2b7ca029d9c72c580ee9161df0aa52d69019ffc6885c0a1b70b860b42c9f106d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Breadcrumb es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/breadcrumb`. Proporciona una ruta de navegación jerárquica con estructura accesible, usando elementos semánticos de navegación y lista.

```tsx
import { StyledBreadcrumb } from "@solidiom/recipes-css"
import * as Breadcrumb from "@solidiom/breadcrumb"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Documentación</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```

## Con puntos suspensivos

Usa la parte Ellipsis para indicar niveles de navegación omitidos.

```tsx
import { StyledBreadcrumb } from "@solidiom/recipes-css"
import * as Breadcrumb from "@solidiom/breadcrumb"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```
