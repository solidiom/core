---
contentSchemaVersion: 1
title: Textarea
description: Native textarea primitive with validation states and optional auto-resizing.
keywords: [and, auto, input, native, optional, primitive, resizing]
locale: es
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: overview
translationSourceHash: "ffc3b0c9f0d78b7e36c5b07429928c3726899edad613de28efc15b9e045de0ad"
translationStatus: draft
notApplicable:
  - section: composition
    reason: Textarea es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Textarea no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Native textarea primitive with validation states and optional auto-resizing.

## Uso

Importa y renderiza `Root`.

```tsx
import * as Textarea from "@solidiom/textarea"

;<Textarea.Root defaultValue="Contenido de Textarea" aria-label="Mensaje" />
```

## Instalación

Instala el paquete con `pnpm add @solidiom/textarea`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Textarea expone 1 parte:

- **Root** — `data-part="root"`.

## Estilos

Textarea lleva los atributos `data-scope="textarea"` y `data-part="root"` para la selección CSS/receta. Los atributos de estado como `data-disabled`, `data-invalid`, `data-readonly` y `data-required` se exponen cuando existe el estado nativo/del componente o el estado ARIA entrante.

## Interacción con teclado

Root es un `<textarea>` nativo que recibe enfoque y conserva el comportamiento normal del navegador para teclado, selección, formularios y foco. Usa `value` para estado controlado, `defaultValue` para un valor inicial no controlado y `onValueChange` para notificaciones de entrada. `autoResize` mide en el cliente después de la liquidación y puede limitarse con `maxRows`.

## Renderizado SSR e hidratación

Textarea se renderiza con su valor nativo y atributos semánticos durante el renderizado en servidor. `defaultValue` es una instantánea inicial no controlada y no se reaplica cuando cambia la propiedad. El autoajuste exclusivo del cliente se ejecuta después de la hidratación y puede cambiar el diseño. `aria-disabled`, `aria-required` y `aria-readonly` entrantes describen el estado, pero por sí solos no establecen las propiedades nativas disabled, required o readonly; pasa las propiedades de estado nativas/del componente cuando se necesita ese comportamiento.
