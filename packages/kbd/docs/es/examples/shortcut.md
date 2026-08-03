---
contentSchemaVersion: 1
title: Kbd - Atajo de teclado
description: Elementos kbd para mostrar combinaciones de teclas.
keywords: [kbd, teclado, atajo, tecla, combinación]
locale: es
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: examples
exampleId: kbd-shortcut
source:
  path: packages/kbd/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Kbd from "@solidiom/kbd"

;<p>
  Presiona <Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>K</Kbd.Root> para abrir el menú de comandos.
</p>
```

## Composición

Cada `Kbd.Root` renderiza un elemento `<kbd>` independiente. Para atajos de múltiples teclas, usa instancias separadas divididas por texto u operadores.