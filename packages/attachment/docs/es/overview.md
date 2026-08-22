---
contentSchemaVersion: 1
title: Attachment
description: Visualización de un archivo adjunto con vista previa, nombre y tamaño.
keywords: [attachment, file, preview, upload, download]
locale: es
maturity: ga
product: Attachment
productLayer: primitive
status: draft
package: "@solidiom/attachment"
primitive: attachment
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "c720ae61becfb945876c4c6db87fc3b903cad9ee79a71da2070f6de8df52ebae"
translationStatus: "draft"
---

Attachment muestra un archivo adjunto individual con sus metadatos y acciones: una miniatura de vista previa, el nombre del archivo, el tamaño y un control para quitarlo.

## Uso

Compón `Root`, `Preview`, `Name`, `Size`, `Remove` e `Icon`.

```tsx
import * as Attachment from "@solidiom/attachment"

;<Attachment.Root>
  <Attachment.Preview>
    <Attachment.Icon />
  </Attachment.Preview>
  <Attachment.Name>informe.pdf</Attachment.Name>
  <Attachment.Size>2.4 MB</Attachment.Size>
  <Attachment.Remove />
</Attachment.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/attachment`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Attachment expone 6 partes:

- **Root** — `data-part="root"`. Contenedor de un archivo adjunto.
- **Preview** — `data-part="preview"`. Región de miniatura o vista previa.
- **Name** — `data-part="name"`. Nombre del archivo.
- **Size** — `data-part="size"`. Tamaño de archivo formateado.
- **Remove** — `data-part="remove"`. Botón para quitar el archivo adjunto.
- **Icon** — `data-part="icon"`. Espacio para el icono del tipo de archivo.

## Estilos

Attachment incluye los atributos `data-scope="attachment"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

La parte `Remove` es un botón operable con teclado (Enter/Espacio). Las demás partes solo muestran contenido.

## Composición

Attachment se compone con `File Input` para mostrar archivos seleccionados y con contenido `Button` o `Icon` dentro de sus espacios de acción.

## SSR e hidratación

Attachment se renderiza como HTML semántico durante el renderizado en servidor. Solo la acción `Remove` requiere hidratación en el cliente para su manejador de clic.
