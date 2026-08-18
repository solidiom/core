---
contentSchemaVersion: 1
title: Entrada básica
description: Componente de entrada de texto con varios tipos y estados.
keywords: [input, text, form, field]
locale: es
maturity: draft
product: Input
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "input"
section: examples
exampleId: input-component-basic
source:
  path: apps/site/src/components/InputExample.tsx
  export: InputExample
  language: tsx
runnable: true
translationSourceHash: "6b8052f73a2951bd0338e81e0c54ba5ae259b8184dab7e3f58f7f0e1ab61bf4c"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Input es un envoltorio de receta estilizada alrededor del primitivo `@solidiom/input`. Soporta múltiples tipos de entrada y estados, incluidos deshabilitado e inválido.

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="text" placeholder="Enter your name" />
```

## Entrada de correo electrónico

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="email" placeholder="you@example.com" />
```

## Estado deshabilitado

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="text" placeholder="Cannot edit" disabled />
```
