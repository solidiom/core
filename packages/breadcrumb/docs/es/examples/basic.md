---
contentSchemaVersion: 1
title: Breadcrumb básico
description: Navegación de migas de pan estándar con múltiples niveles.
keywords: [breadcrumb, navegación, jerarquía, enlaces, ruta]
locale: es
maturity: draft
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: examples
exampleId: breadcrumb-basic
source:
  path: packages/breadcrumb/src/index.tsx
  export: Root, List, Item, Link, Separator, Ellipsis
  language: tsx
runnable: false
translationSourceHash: "e08b8415ac0f71f1c7475ff52aa28250f3b4ffa760f836420858a2761e8ed9a3"
translationStatus: draft
---

```tsx
import * as Breadcrumb from "@solidiom/breadcrumb"

;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/productos">Productos</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/productos/widget" current>
        Widget
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Con elipsis

Usa `Ellipsis` para indicar niveles omitidos en una ruta de migas de pan profundamente anidada.

```tsx
;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/productos/widget" current>
        Widget
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Separador personalizado

Proporciona contenido personalizado a `Separator` para cambiar el divisor visual entre elementos.

```tsx
;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Inicio</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>&gt;</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs" current>
        Documentación
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```
