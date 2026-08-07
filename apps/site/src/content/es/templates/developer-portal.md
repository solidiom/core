---
contentSchemaVersion: 1
title: "Developer Portal"
description: "Portal de desarrolladores con documentación, playground de SDK y gestión de aplicaciones."
keywords: [developer-portal, plantilla, inicio, solid, desarrolladores, sdk, enterprise]
locale: es
maturity: draft
product: "Developer Portal"
productLayer: template
status: draft
package: "@solidiom/template-developer-portal"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "c7ada6107fbf8cc89cbb6e56cdc4e9c482568d7e9f130331a0acd05d6f64fd28"
translationStatus: draft
---

Developer Portal proporciona un punto de partida listo para producción para construir plataformas de experiencia de desarrollador con documentación, herramientas interactivas y gestión del ciclo de vida de aplicaciones.

## Resumen

Esta plantilla crea un portal de desarrolladores completo con documentación de API con guías, referencias de SDK y ejemplos de código, un playground interactivo para probar llamadas API e integraciones de SDK, y una consola de gestión de aplicaciones para registrar clientes OAuth y configurar webhooks.

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
solidiom create my-app --template developer-portal
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
