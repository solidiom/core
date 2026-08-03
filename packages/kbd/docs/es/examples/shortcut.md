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
translationSourceHash: "3ff880afa2996ef8b67ee3917f4c316b01c51c02142e41645409e46eb0742f8c"
translationStatus: draft
---

```tsx
import * as Kbd from "@solidiom/kbd"

;<p>
  Presiona <Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>K</Kbd.Root> para abrir el menú de comandos.
</p>
```

## Composición

Cada `Kbd.Root` renderiza un elemento `<kbd>` independiente. Para atajos de múltiples teclas, usa instancias separadas divididas por texto u operadores.
