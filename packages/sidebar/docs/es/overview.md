---
contentSchemaVersion: 1
title: Sidebar
description: Panel de navegación lateral de aplicación que se puede contraer.
keywords: [sidebar, navigation, collapsible, panel, disclosure, rail]
locale: es
maturity: ga
product: Sidebar
productLayer: primitive
status: draft
package: "@solidiom/sidebar"
primitive: sidebar
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "a6fd861bfc2c0877456fb2608cc776f4872abedd3f38c8face19650090d1b2c6"
translationStatus: "draft"
---

Sidebar es un panel de navegación de aplicación que se puede contraer, con estado de disclosure accesible y gestión de presencia. `Trigger` alterna entre contraído y expandido, `Rail` es el asa estrecha cuando está contraído y `Panel` contiene la navegación.

## Uso

Compón `Root`, `Panel`, `Trigger`, `Header`, `Content`, `Footer` y `Rail`. `Trigger` alterna el estado contraído mientras `Panel` contiene la navegación.

```tsx
import * as Sidebar from "@solidiom/sidebar"

;<Sidebar.Root>
  <Sidebar.Panel>
    <Sidebar.Header>Logotipo</Sidebar.Header>
    <Sidebar.Content>{/* navegación */}</Sidebar.Content>
    <Sidebar.Footer>Cuenta</Sidebar.Footer>
  </Sidebar.Panel>
  <Sidebar.Rail />
  <Sidebar.Trigger>Alternar</Sidebar.Trigger>
</Sidebar.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/sidebar`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

sidebar expone 7 partes:

- **Root** — contenedor que gestiona el estado de disclosure y la presencia.
- **Panel** — contiene el contenido de navegación.
- **Trigger** — alterna entre contraído y expandido.
- **Header** — región superior del panel.
- **Content** — región principal de navegación.
- **Footer** — región inferior del panel.
- **Rail** — asa estrecha cuando está contraído.

## Estilos

sidebar incluye los atributos `data-scope="sidebar"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

`Trigger` alterna los estados contraído y expandido mediante semántica de disclosure accesible y gestión de presencia; el primitivo no define atajos de teclado adicionales.

## Composición

Compón primitivos de navegación, enlaces y botones dentro de `Content` para crear el menú de la aplicación; Rail proporciona un asa compacta cuando está contraído.

## SSR e hidratación

El panel se renderiza como HTML estático con su estado de disclosure inicial en el servidor; Trigger y la gestión de presencia se activan durante la hidratación.
