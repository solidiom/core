---
contentSchemaVersion: 1
title: "SaaS Dashboard"
description: "Panel SaaS con navegación, métricas y gestión de recursos."
keywords: [saas-dashboard, plantilla, inicio, solid, panel]
locale: es
maturity: beta
product: "SaaS Dashboard"
productLayer: template
status: published
package: "@solidiom/template-saas-dashboard"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "27da56b29b21480d5247675f41e66256cb81734b14b7c88759a56e84f9047830"
translationStatus: draft
---

SaaS Dashboard proporciona un punto de partida listo para producción para aplicaciones SaaS con observabilidad y gestión de recursos.

## Resumen

Esta plantilla crea un panel SaaS completo con shell de navegación, métricas, eventos en tiempo real y vistas de lista de recursos.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SHELL-03 (Notifications Center)
- BLOCK-OBS-01 (Dashboard Overview)
- BLOCK-OBS-02 (Real-time Events)
- BLOCK-RESOURCE-01 (Resource List)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template saas-dashboard
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
