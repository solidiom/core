---
contentSchemaVersion: 1
title: File Input
description: Control de carga de archivos con soporte para zona de arrastre y validación.
keywords: [file input, upload, dropzone, drag and drop, validation, file list]
locale: es
maturity: ga
product: File Input
productLayer: primitive
status: draft
package: "@solidiom/file-input"
primitive: file-input
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "aabeda8542fcce19fbeebdb151f91cf7511a09a02095b2fb0496c46c47bcf052"
translationStatus: "draft"
---

File Input proporciona un control de carga de archivos con una zona de arrastre y validación. Admite abrir el selector mediante clic con Trigger, cargas mediante arrastrar y soltar con `createDropzone`, y valida los archivos por tipo, tamaño y cantidad. Las listas de archivos pueden ser controladas o no controladas.

## Uso

Compón `Root`, `Trigger`, `HiddenInput`, `FileList`, `FileItem` y `FileRemove`. `HiddenInput` es el `<input type="file">` nativo y Trigger permite abrir el selector mediante clic.

```tsx
import * as FileInput from "@solidiom/file-input"

;<FileInput.Root>
  <FileInput.Trigger>Elegir archivos</FileInput.Trigger>
  <FileInput.HiddenInput />
  <FileInput.FileList>
    <FileInput.FileItem>
      <FileInput.FileRemove>Quitar</FileInput.FileRemove>
    </FileInput.FileItem>
  </FileInput.FileList>
</FileInput.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/file-input`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

file-input expone 6 partes:

- **Root** — contenedor que gestiona la lista de archivos, la zona de arrastre y la validación (tipo, tamaño y cantidad).
- **Trigger** — control que abre el selector de archivos mediante clic.
- **HiddenInput** — el `<input type="file">` nativo.
- **FileList** — contenedor que renderiza los archivos seleccionados.
- **FileItem** — una entrada de archivo seleccionado.
- **FileRemove** — control que quita de la lista el archivo asociado.

## Estilos

file-input incluye los atributos `data-scope="file-input"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Trigger abre el explorador de archivos nativo mediante un clic, y se pueden añadir archivos arrastrándolos a la zona de arrastre. La validación aplica tipo, tamaño y cantidad. La lista de archivos admite uso controlado y no controlado.

## Composición

Compón con primitivos de botones, iconos o campos para crear un control de carga completo; HiddenInput gestiona la participación en formularios nativos.

## SSR e hidratación

La estructura se renderiza como HTML estático en el servidor; los manejadores de la zona de arrastre y Trigger se activan durante la hidratación en el cliente.
