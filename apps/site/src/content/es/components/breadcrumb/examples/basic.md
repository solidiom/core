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
translationSourceHash: "26670d63b452345bfde119cd8b98ed8ebb37f9dc6b938543a41c7c00f343de23"
translationStatus: draft
---

El componente Breadcrumb es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/breadcrumb`. Proporciona una ruta de navegación jerárquica con estructura accesible, usando elementos semánticos de navegación y lista.

```tsx
import { StyledBreadcrumb, Breadcrumb } from "@solidiom/recipes-css"

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
      <Breadcrumb.Link href="/docs/breadcrumb" current>Breadcrumb</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```

## Con puntos suspensivos

Usa la parte Ellipsis para indicar niveles de navegación omitidos.

```tsx
import { StyledBreadcrumb, Breadcrumb } from "@solidiom/recipes-css"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>Breadcrumb</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```