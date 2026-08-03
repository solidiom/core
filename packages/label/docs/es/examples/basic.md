---
contentSchemaVersion: 1
title: Label - Uso básico
description: Label vinculado a un campo de entrada con indicadores de estado.
keywords: [label, básico, formulario, entrada]
locale: es
maturity: draft
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
section: examples
exampleId: label-basic
source:
  path: packages/label/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"

;<div>
  <Label.Root htmlFor="username" required>
    Nombre de usuario
  </Label.Root>
  <Input.Root id="username" type="text" required />
</div>
```

## Estados

La propiedad `required` en Label emite `data-required` para estilo. Las propiedades `disabled` e `invalid` funcionan de la misma manera. Estos son puramente presentacionales; el estado real de validación del formulario reside en el control.
