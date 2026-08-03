---
contentSchemaVersion: 1
title: Kbd
description: Elemento de visualización de atajos de teclado con marcado semántico.
keywords: [kbd, teclado, atajo, visualización, tecla]
locale: es
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: overview
translationSourceHash: "0000000000000000000000000000000000000000000000000000000000000000"
translationStatus: draft
---

Kbd renderiza un elemento `<kbd>` semántico para mostrar atajos de teclado y combinaciones de teclas. Úsalo para documentar interacciones por teclado dentro de instrucciones, texto de ayuda o etiquetas de interfaz.

## Uso

Kbd tiene una sola parte `Root`. Pasa el nombre de la tecla o la combinación como hijos.

```tsx
import * as Kbd from "@solidiom/kbd"

;<p>
  Presiona <Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>S</Kbd.Root> para guardar.
</p>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/kbd`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Estilos

Kbd lleva los atributos `data-scope="kbd"` y `data-part="root"`. Estílalo con una fuente monoespaciada, un fondo sutil y un borde para diferenciarlo del texto circundante. El elemento hereda el estilo por defecto del navegador para `<kbd>`; sobrescríbelo con tu receta para una apariencia coherente.

## Renderizado SSR e hidratación

Kbd es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
