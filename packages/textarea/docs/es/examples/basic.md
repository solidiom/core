---
contentSchemaVersion: 1
title: Textarea - Uso básico
description: Ejemplo básico de textarea demostrando el comportamiento principal.
keywords: [textarea, básico, ejemplo]
locale: es
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: examples
exampleId: textarea-basic
source:
  path: packages/textarea/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "Sin interacción con teclado declarada en el contrato de accesibilidad."
translationSourceHash: "88f6b6653ce33c646a8e1b4e61e46f2f16049c17b497563692a64f10bc34afdd"
translationStatus: draft
---

```tsx
import * as Textarea from "@solidiom/textarea"

;<Textarea.Root defaultValue="Contenido de Textarea" aria-label="Mensaje" />
```
