---
contentSchemaVersion: 1
title: Plantilla inicial de Vite + Solid Router
description: Una plantilla inicial de Solid solo del lado del cliente, generada con Vite y Solid Router, lista para `solidiom add`.
keywords:
  - vite
  - solid-router
  - plantilla
  - template
  - solo cliente
locale: es
maturity: beta
product: solidiom
productLayer: template
status: published
package: "@solidiom/template-vite-solid-router"
stack: vite-solid-router
portfolios:
  - balanced-product
translationSourceHash: "5eb104cab4953a540ae257153b1f1212a0fb4865824f80b2a5fc7c7017cd7a12"
translationStatus: draft
---

# Plantilla inicial de Vite + Solid Router

Una aplicación Solid mínima, solo del lado del cliente, generada con [Vite](https://vitejs.dev)
y [Solid Router](https://github.com/solidjs/solid-router). Sin renderizado del lado del
servidor — esta plantilla es la vía más rápida para tener un proyecto Solidiom funcionando
cuando no necesitas SSR.

## Qué incluye

- Un servidor de desarrollo Vite y una compilación de producción, preconfigurados para Solid.
- Dos rutas (`/` y `/about`) conectadas mediante `@solidjs/router`, que muestran la navegación
  del lado del cliente con el componente `<A>`.
- Un primitivo de Solidiom (`@solidiom/button`) renderizado con la receta de estilos de
  Tailwind, para que puedas ver un componente real ya estilizado.
- Un archivo `.solidiom/config.json` generado, para que el proyecto esté listo de inmediato
  para `solidiom add <primitivo>`.

## Genera un proyecto

```sh
solidiom create my-app --template vite-solid-router
```

Pasa `--yes` para omitir las preguntas, `--styling` para elegir un perfil de estilos (`css`,
`tailwind` o `unocss`), y `--no-install` si prefieres ejecutar el paso de instalación tú mismo.

## Cuándo elegir esta plantilla

Elige `vite-solid-router` cuando tu proyecto no necesite renderizado del lado del servidor —
paneles de control, herramientas internas y aplicaciones de una sola página que generan un
paquete estático son un buen caso de uso. Si necesitas SSR, una plantilla basada en SolidStart
está planeada para una versión futura.
