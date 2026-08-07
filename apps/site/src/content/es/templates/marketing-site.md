---
contentSchemaVersion: 1
title: "Marketing Site"
description: "Sitio de marketing con página de aterrizaje, funcionalidades y precios."
keywords: [marketing-site, plantilla, inicio, solid, marketing, landing, precios]
locale: es
maturity: draft
product: "Marketing Site"
productLayer: template
status: draft
package: "@solidiom/template-marketing-site"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6"
translationStatus: draft
---

Marketing Site proporciona un punto de partida listo para producción para construir sitios web de marketing de producto con layouts optimizados para conversión.

## Resumen

Esta plantilla crea un sitio web de marketing completo con una página de aterrizaje con propuesta de valor y prueba social, una página de funcionalidades mostrando las capacidades del producto, y una página de precios con comparación de planes y preguntas frecuentes.

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
solidiom create my-app --template marketing-site
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
