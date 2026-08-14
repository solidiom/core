---
contentSchemaVersion: 1
title: Label - Descripción general
description: Elemento label accesible vinculado a controles de formulario mediante htmlFor.
keywords: [label, formulario, accesible, htmlfor, input]
locale: es
maturity: ga
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
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

translationSourceHash: "eb5c9de84529497b8460dd109d5cb2d8ac20cad1532d969aad340c8aaadde06e"
translationStatus: draft
---

Label renderiza un elemento nativo `<label>` con atributos de datos semánticos. Úsalo para asociar texto con controles de formulario, proporcionando la conexión de accesibilidad requerida por las tecnologías de asistencia.

## Uso

Label tiene una sola parte `Root`. Usa `htmlFor` para vincularlo a un control de formulario mediante su `id`.

```tsx
import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"

;<div>
  <Label.Root htmlFor="email">Correo electrónico</Label.Root>
  <Input.Root id="email" type="email" />
</div>
```

Label está diseñado para componerse con el primitivo `Field`. Cuando se usa dentro de `Field`, el cableado de `htmlFor` a menudo se maneja automáticamente.

### Indicadores de estado

Usa las props `disabled`, `required`, e `invalid` para reflejar el estado del control asociado. Estas emiten atributos `data-disabled`, `data-required`, y `data-invalid` para propósitos de estilo. No afectan el control de formulario en sí; el control es dueño de su propio estado.

## Instalación

Instala el paquete con `pnpm add @solidiom/label`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Estilo

Label carries `data-scope="label"` y `data-part="root"` atributos. Las banderas de estado (`data-disabled`, `data-required`, `data-invalid`) están disponibles para estilo condicional. El elemento hereda el estilo predeterminado del navegador para `<label>`; sobrescríbelo con tu receta para una apariencia consistente.

## SSR e hidratación

Label es un elemento estático de presentación sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación del lado del cliente.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.
