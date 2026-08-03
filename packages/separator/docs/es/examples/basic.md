---
contentSchemaVersion: 1
title: Separator básico
description: Ejemplos de separator horizontal y vertical.
keywords: [separator, divisor, horizontal, vertical, decorativo]
locale: es
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: examples
exampleId: separator-basic
source:
  path: packages/separator/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "9c2697b7588e992ffd3dd9b155911b8b2da45b4806b4df96d12410bf3b9ef3d1"
translationStatus: draft
---

```tsx
import * as Separator from "@solidiom/separator"

;<section>
  <p>Contenido de la sección por encima del divisor.</p>
  <Separator.Root />
  <p>Contenido de la sección por debajo del divisor.</p>
</section>
```

## Variantes

Usa el prop `orientation` para separadores verticales en diseños lado a lado.

```tsx
;<div style={{ display: "flex" }}>
  <aside>Barra lateral</aside>
  <Separator.Root orientation="vertical" />
  <main>Contenido principal</main>
</div>
```

## Decorativo

Cuando el divisor es puramente visual y no carries significado estructural, establece `decorative` para ocultarlo de las tecnologías de asistencia.

```tsx
;<Separator.Root decorative />
```
