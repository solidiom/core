---
contentSchemaVersion: 1
title: "API Management"
description: "Gestión de APIs con catálogo de endpoints, gestión de claves y analítica de uso."
keywords: [api-management, plantilla, inicio, solid, api, claves, enterprise]
locale: es
maturity: draft
product: "API Management"
productLayer: template
status: draft
package: "@solidiom/template-api-management"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3"
translationStatus: draft
---

API Management proporciona un punto de partida listo para producción para construir consolas de gateway de APIs con descubrimiento de endpoints, ciclo de vida de claves y analítica.

## Resumen

Esta plantilla crea una aplicación completa de gestión de APIs con un catálogo de endpoints para navegar, buscar y documentar APIs, una interfaz de gestión de claves para crear, rotar y revocar claves API con políticas de alcance, y analítica de uso mostrando volumen de peticiones, percentiles de latencia y tasas de error.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-RESOURCE-01 (Resource List)
- BLOCK-RESOURCE-02 (Resource Detail)
- BLOCK-RESOURCE-03 (Resource Create)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template api-management
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
