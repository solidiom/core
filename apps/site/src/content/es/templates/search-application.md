---
contentSchemaVersion: 1
title: "Search Application"
description: "Aplicación de búsqueda con resultados, búsquedas guardadas y analítica."
keywords: [search-application, plantilla, inicio, solid, búsqueda, analítica]
locale: es
maturity: draft
product: "Search Application"
productLayer: template
status: draft
package: "@solidiom/template-search-application"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2"
translationStatus: draft
---

Search Application proporciona un punto de partida listo para producción para construir interfaces de búsqueda de texto completo con filtrado por facetas.

## Resumen

Esta plantilla crea una aplicación de búsqueda completa con resultados clasificados y filtros, consultas de búsqueda guardadas con suscripciones de alertas, y un panel de analítica de búsqueda para monitorear el rendimiento de las consultas.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SEARCH-01 (Search Results)
- BLOCK-SEARCH-02 (Saved Searches)
- BLOCK-SEARCH-03 (Search Analytics)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template search-application
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
