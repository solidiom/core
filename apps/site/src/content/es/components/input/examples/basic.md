---
contentSchemaVersion: 1
title: Entrada básica
description: Entrada de texto y área de texto con estados de validación y estilos.
keywords: [input, textarea, form, styled, recipe]
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
  path: apps/site/src/components/InputComponentExample.tsx
  export: InputComponentExample
  language: tsx
runnable: true
translationSourceHash: "dc7741696ea6904537d61a3d04cb5f5ef02991712050039e97669f966b968d99"
translationStatus: draft
---

El componente Input proporciona entrada de texto estilizada y área de texto con hooks de estado de validación.

```tsx
import { StyledInput, StyledTextarea } from "@solidiom/recipes-css"

;<StyledInput placeholder="Enter your name" />
```

## Con estado de validación

Usa la propiedad `invalid` para indicar errores de validación.

```tsx
;<StyledInput placeholder="Email address" type="email" invalid />
```

## Textarea

Usa `StyledTextarea` para entrada de texto de varias líneas.

```tsx
;<StyledTextarea placeholder="Enter a message" rows={4} />
```

## Estado deshabilitado

```tsx
;<StyledInput placeholder="Read-only field" disabled />
```