---
contentSchemaVersion: 1
title: Tokenizer
description: Entrada de etiquetas o tokens para gestionar varios valores con soporte de teclado.
keywords: [tokenizer, tags, tokens, input, roving focus, paste, multi-value]
locale: es
maturity: ga
product: Tokenizer
productLayer: primitive
status: draft
package: "@solidiom/tokenizer"
primitive: tokenizer
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "e2af934c038855c6900aef3815a97b4e20eeb744d5935feb86458507f87bc235"
translationStatus: "draft"
---

Tokenizer es una entrada de etiquetas o tokens para gestionar varios valores con soporte de teclado. Proporciona foco roving entre tokens, soporte para pegar, estado de selección, prevención de duplicados, aplicación de un límite máximo y participación en formularios.

## Uso

Compón `Root`, `Token`, `TokenRemove` e `Input`. Cada `Token` representa un valor con un control `TokenRemove`, e `Input` acepta nuevas entradas.

```tsx
import * as Tokenizer from "@solidiom/tokenizer"

;<Tokenizer.Root>
  <Tokenizer.Token>
    diseño
    <Tokenizer.TokenRemove>×</Tokenizer.TokenRemove>
  </Tokenizer.Token>
  <Tokenizer.Input />
</Tokenizer.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/tokenizer`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

tokenizer expone 4 partes:

- **Root** — contenedor que gestiona tokens, selección, prevención de duplicados, límite máximo y participación en formularios.
- **Token** — un token individual que representa un valor.
- **TokenRemove** — control que quita su token.
- **Input** — campo para escribir nuevos tokens, con soporte para pegar.

## Estilos

tokenizer incluye los atributos `data-scope="tokenizer"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

tokenizer admite foco roving entre tokens, pegado, estado de selección, prevención de duplicados y aplicación de un límite máximo.

| Tecla            | Comportamiento                         |
| ---------------- | -------------------------------------- |
| Enter / coma     | Añade un token                         |
| Backspace        | Quita el último token                  |
| Teclas de flecha | Se desplaza entre tokens (foco roving) |

## Composición

Compón con primitivos de etiqueta y campo para crear un control de varios valores etiquetado; Root gestiona la participación en formularios.

## SSR e hidratación

Los tokens existentes se renderizan como HTML estático en el servidor y participan en formularios nativos; el foco roving, el pegado y los manejadores para añadir o quitar se activan durante la hidratación.
