---
contentSchemaVersion: 1
title: Code Block
description: Visualización de código con resaltado de sintaxis, botón de copia y números de línea.
keywords: [code, block, syntax, highlight, copy, line numbers, clipboard]
locale: es
maturity: ga
product: Code Block
productLayer: primitive
status: draft
package: "@solidiom/code-block"
primitive: code-block
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "b427aa6b6fe596d4670dc26e269093ceb60dd5d13a789a50e45b23b065f121ba"
translationStatus: "draft"
---

Code Block es una visualización de código con resaltado de sintaxis, botón de copia y números de línea. CopyButton copia el código al portapapeles y Language muestra la etiqueta del lenguaje.

## Uso

Compón `Root`, `Pre`, `Code`, `LineNumbers`, `CopyButton`, `Header` y `Language`.

```tsx
import * as CodeBlock from "@solidiom/code-block"

function Snippet() {
  return (
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Language>tsx</CodeBlock.Language>
        <CodeBlock.CopyButton>Copiar</CodeBlock.CopyButton>
      </CodeBlock.Header>
      <CodeBlock.Pre>
        <CodeBlock.LineNumbers />
        <CodeBlock.Code>{`const x = 1;`}</CodeBlock.Code>
      </CodeBlock.Pre>
    </CodeBlock.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/code-block`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

code-block expone 7 partes:

- **Root** — `data-part="root"`. Contenedor de la visualización del código.
- **Pre** — `data-part="pre"`. Bloque preformateado que envuelve el código.
- **Code** — `data-part="code"`. Contiene el código con resaltado de sintaxis.
- **LineNumbers** — `data-part="linenumbers"`. Renderiza los números de línea junto al código.
- **CopyButton** — `data-part="copybutton"`. Copia el código al portapapeles.
- **Header** — `data-part="header"`. Región de encabezado para la etiqueta de lenguaje y el control de copia.
- **Language** — `data-part="language"`. Muestra la etiqueta del lenguaje.

## Estilos

code-block incluye los atributos `data-scope="code-block"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia más allá de CopyButton, que copia el código al portapapeles cuando se activa.

## Composición

Code Block se compone dentro de documentación, chats y superficies de contenido para mostrar código formateado con una acción de copia.

## SSR e hidratación

Code Block renderiza HTML estático en el servidor; CopyButton activa su manejador del portapapeles durante la hidratación.
