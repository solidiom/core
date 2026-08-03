---
contentSchemaVersion: 1
title: Visually hidden básico
description: Ejemplo de etiqueta solo para lectores de pantalla.
keywords: [visually-hidden, lector-de-pantalla, etiqueta, accesibilidad, icono]
locale: es
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: examples
exampleId: visually-hidden-basic
source:
  path: packages/visually-hidden/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "1993ac7e64336006d76c3bac2dbacf6f9580d57e19644b537f63fafcebd2c96d"
translationStatus: draft
---

```tsx
import * as VisuallyHidden from "@solidiom/visually-hidden"

;<button>
  <VisuallyHidden.Root>Cerrar diálogo</VisuallyHidden.Root>
  <span aria-hidden="true">&times;</span>
</button>
```

## Encabezado oculto

Usa Visually Hidden para proporcionar encabezados a los lectores de pantalla que den estructura sin desorden visual.

```tsx
;<article>
  <VisuallyHidden.Root>
    <h2>Artículos Relacionados</h2>
  </VisuallyHidden.Root>
  <ul>
    <li>Artículo uno</li>
    <li>Artículo dos</li>
  </ul>
</article>
```

## Instrucciones de campos de formulario

Oculta instrucciones verbosas de campos de formulario visualmente mientras las mantienes accesibles para lectores de pantalla.

```tsx
;<label>
  <VisuallyHidden.Root>Ingresa tu dirección de correo electrónico</VisuallyHidden.Root>
  <input type="email" placeholder="Correo" />
</label>
```
