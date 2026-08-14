---
contentSchemaVersion: 1
title: Kbd
description: Elemento de visualización de atajos de teclado con marcado semántico.
keywords: [kbd, teclado, atajo, visualización, tecla]
locale: es
maturity: ga
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: overview
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Sin primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. No existe comportamiento no obvio específico.
translationSourceHash: "60bd03649e25b586a46580f9f159380e665a14ce932b22e7cb5c4ea7bca81213"
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

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.

## Partes

Kbd expone una única parte `Root`. Renderiza un elemento `<kbd>` en línea con los atributos `data-scope="kbd"` y `data-part="root"`.

## Renderizado SSR e hidratación

Kbd es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
