---
contentSchemaVersion: 1
title: Input OTP
description: A one-time password input with individual character slots.
keywords: [character, individual, input, one, otp, password, runtime]
locale: es
maturity: ga
product: Input OTP
productLayer: primitive
status: draft
package: "@solidiom/input-otp"
primitive: input-otp
section: overview
notApplicable:
  - section: relationships
    reason: Input OTP no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "ca64dff65b05a43ef39d0fa78b3ecb740741f9449a02425bc204bc2168bebe61"
translationStatus: draft
---

A one-time password input with individual character slots.

## Uso

Compón `Root`, `Group`, `Slot`.

```tsx
import * as InputOtp from "@solidiom/input-otp"

;<InputOtp.Root>Contenido de Input OTP</InputOtp.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/input-otp`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Input OTP expone 3 partes:

- **Root** — `data-part="root"`.
- **Group** — `data-part="group"`.
- **Slot** — `data-part="slot"`.

## Estilos

Input OTP lleva los atributos `data-scope="input-otp"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Input OTP está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Input OTP se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
