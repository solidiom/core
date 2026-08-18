---
contentSchemaVersion: 1
title: Astro + Solid Starter
description: "Plantilla de inicio para proyectos Astro con islas Solid usando la integracion Solidiom."
keywords: [astro-solid, plantilla, inicio, solid, astro, islands, ssr]
locale: es
maturity: beta
product: Astro + Solid Starter
productLayer: template
status: published
package: "@solidiom/astrojs-solid-next"
stack: astro-solid
portfolios: ["balanced-product"]
translationSourceHash: "29467acafd0527bd784f4d8cd9cb461c012bfd9b1e367cf3c9e854895d1f0d81"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Astro + Solid Starter proporciona un punto de partida listo para produccion para proyectos Astro con islas Solid 2 impulsadas por la integracion Solidiom.

## Resumen

Esta plantilla crea un proyecto Astro completo con islas de componentes Solid 2, resolucion automatica de alias de fuente para primitivas Solidiom, y soporte SSR listo para usar. Utiliza `@solidiom/astrojs-solid-next` para conectar la arquitectura de islas de Astro con el renderizado reactivo de Solid.

## Stack

- **Framework:** Astro + Solid 2
- **Enrutamiento:** Enrutamiento basado en archivos con Astro
- **Renderizado:** SSR con hidratacion parcial (islas)
- **Herramienta de construccion:** Vite

## Caracteristicas principales

- Resolucion automatica de la condicion de exportacion `solid` para todas las primitivas `@solidiom/*`
- Soporte multi-renderer con alcance configurable mediante `include`/`exclude`
- Container renderer para el pipeline de renderizado del lado del servidor de Astro
- Compatible con Astro 5, 6 y 7

## Instalacion

```sh
npm install @solidiom/astrojs-solid-next
```

Luego agrega la integracion a tu `astro.config.ts`:

```ts
import solid from "@solidiom/astrojs-solid-next"

export default defineConfig({
  integrations: [solid()],
})
```

Si usas multiples renderers JSX (por ejemplo, React y Solid), delimita la integracion con `include`/`exclude`:

```ts
solid({ include: ["**/components/solid/**"] })
```

## Estilos

La plantilla funciona con cualquier perfil de estilo de Solidiom (CSS, Tailwind o UnoCSS). El sistema de temas permite cambiar entre presets sin modificar el codigo de los componentes.

## Despliegue

Despliega la salida a cualquier plataforma de alojamiento que soporte Astro. Vercel, Netlify y Cloudflare Pages son destinos soportados.
