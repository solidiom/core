---
contentSchemaVersion: 1
title: Plantilla inicial de TanStack Start (Solid) con SSR
description: Una plantilla inicial de Solid renderizada en el servidor, generada con TanStack Start y TanStack Router, lista para `solidiom add`.
keywords:
  - tanstack
  - tanstack-start
  - tanstack-router
  - ssr
  - plantilla
  - template
locale: es
maturity: beta
product: solidiom
productLayer: template
status: published
package: "@solidiom/template-tanstack-start-solid"
stack: tanstack-start-solid
portfolios:
  - balanced-product
translationSourceHash: 5a4a61ac1c4e8048a7c2eceedff43378665ebcabd064f9e920c83ae75586ec43
translationStatus: draft
---

# Plantilla inicial de TanStack Start (Solid) con SSR

Una aplicación Solid renderizada en el servidor, generada con [TanStack Start](https://tanstack.com/start)
y [TanStack Router](https://tanstack.com/router), ambos construidos nativamente para Solid 2 en
lugar de adaptados desde una base de código de Solid 1. Esta es la contraparte con SSR de
`vite-solid-router` — elige esta plantilla cuando tu proyecto necesite renderizado completo del
lado del servidor.

## Qué incluye

- Una configuración del plugin de Vite de TanStack Start, preconfigurada para Solid, que produce
  paquetes de producción independientes para cliente y servidor.
- Dos rutas basadas en archivos (`/` y `/about`) conectadas mediante `@tanstack/solid-router`,
  que muestran navegación renderizada en el servidor.
- Un primitivo de Solidiom (`@solidiom/button`) renderizado con la receta de estilos de Tailwind,
  para que puedas ver un componente real ya estilizado — la misma demostración que usa
  `vite-solid-router`, para comparar directamente ambas plantillas.
- Un archivo `.solidiom/config.json` generado, para que el proyecto esté listo de inmediato para
  `solidiom add <primitivo>`.

## Genera un proyecto

```sh
solidiom create my-app --template tanstack-start-solid
```

Pasa `--yes` para omitir las preguntas, `--styling` para elegir un perfil de estilos (`css`,
`tailwind` o `unocss`), y `--no-install` si prefieres ejecutar el paso de instalación tú mismo.

## Cuándo elegir esta plantilla

Elige `tanstack-start-solid` cuando tu proyecto necesite renderizado del lado del servidor —
sitios orientados a contenido, cualquier cosa que se beneficie del SEO, y páginas que necesitan
datos disponibles antes del primer renderizado son un buen caso de uso. Si tu proyecto es un
panel de control, una herramienta interna o una aplicación de una sola página que no necesita
renderizado en el servidor, `vite-solid-router` ofrece una alternativa solo de cliente, más
pequeña y simple.

## Por qué TanStack Start en lugar de SolidStart

Este workspace fija `solid-js@2.0.0-beta.24`. Al momento de construir esta plantilla, la línea
publicada de SolidStart todavía dependía internamente de `solid-js@1.x` y su API de configuración
no exportaba la función que las herramientas de este workspace esperaban, por lo que no podía
compilar contra este fijado. Las `peerDependencies` de TanStack Start declaran
`solid-js: ">=2.0.0-0 <3.0.0"` y `@solidjs/web: ">=2.0.0-0 <3.0.0"` — construido para Solid 2
desde el inicio, no adaptado después.
