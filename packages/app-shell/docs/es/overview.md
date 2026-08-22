---
contentSchemaVersion: 1
title: App Shell
description: Diseño de aplicación de nivel superior con áreas de encabezado, barra lateral y contenido principal.
keywords: [app-shell, layout, header, sidebar, main, footer]
locale: es
maturity: ga
product: App Shell
productLayer: primitive
status: draft
package: "@solidiom/app-shell"
primitive: app-shell
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "2c7654cf8b03f965ffbe5b809eb79cfdeb6ebf9c796a7303f2fdf252235b680a"
translationStatus: "draft"
---

App Shell proporciona un diseño de aplicación de nivel superior que organiza un encabezado, una barra lateral, un área de contenido principal y un pie de página en una estructura coherente. Es un primitivo puramente estructural que controla las regiones de diseño y sus landmarks semánticos.

## Uso

Compón `Root`, `Header`, `Sidebar`, `Main` y `Footer`.

```tsx
import * as AppShell from "@solidiom/app-shell"

;<AppShell.Root>
  <AppShell.Header>Encabezado</AppShell.Header>
  <AppShell.Sidebar>Navegación</AppShell.Sidebar>
  <AppShell.Main>Contenido de la página</AppShell.Main>
  <AppShell.Footer>Pie de página</AppShell.Footer>
</AppShell.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/app-shell`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

App Shell expone 5 partes:

- **Root** — `data-part="root"`. Contenedor del diseño.
- **Header** — `data-part="header"`. Región de la barra superior de la aplicación.
- **Sidebar** — `data-part="sidebar"`. Región de navegación lateral.
- **Main** — `data-part="main"`. Región de contenido principal.
- **Footer** — `data-part="footer"`. Región inferior.

## Estilos

App Shell incluye los atributos `data-scope="app-shell"` y `data-part` en cada parte para seleccionar estilos CSS o recetas. Estiliza el root como un diseño grid o flex y posiciona las regiones mediante los atributos data.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia. Renderiza regiones estructurales; el comportamiento interactivo pertenece al contenido colocado en cada región.

## Composición

App Shell está diseñado para alojar otros primitivos. Coloca una navegación `Sidebar`, un `Banner`, un `Breadcrumb` o cualquier primitivo de contenido dentro de sus regiones.

## SSR e hidratación

App Shell es un elemento de diseño pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
