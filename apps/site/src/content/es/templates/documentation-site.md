---
contentSchemaVersion: 1
title: "Documentation Site"
description: "Sitio de documentación con lector de docs, referencia de API y guías."
keywords: [documentation-site, plantilla, inicio, solid, docs, api, guías]
locale: es
maturity: beta
product: "Documentation Site"
productLayer: template
status: published
package: "@solidiom/template-documentation-site"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "b715b2d5b08174038c2b60ea00b264238479ba8a7eecfb7a8220586c582ae0c3"
translationStatus: draft
---

Documentation Site proporciona un punto de partida listo para producción para construir sitios web de documentación técnica y referencia de producto.

## Resumen

Esta plantilla crea un sitio de documentación completo con un lector de docs con navegación lateral, búsqueda y cambio de versión, una referencia de API con firmas de tipos generadas automáticamente y ejemplos, y guías tutorial paso a paso con ejemplos de código ejecutables.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-CONTENT-01 (Content Editor)
- BLOCK-CONTENT-02 (Content Library)
- BLOCK-CONTENT-03 (Content Workflow)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template documentation-site
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
