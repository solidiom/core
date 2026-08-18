---
contentSchemaVersion: 1
title: "Observability Console"
description: "Consola de observabilidad con paneles, eventos y alertas."
keywords: [observability-console, plantilla, inicio, solid, monitoreo, enterprise]
locale: es
maturity: beta
product: "Observability Console"
productLayer: template
status: published
package: "@solidiom/template-observability-console"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise-platform-governance"]
translationSourceHash: "b1cb3a69bc907f4bfbc70ac62497c5a73b6d3d5eb46c26762135f40966f96337"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Observability Console proporciona un punto de partida listo para producción para monitoreo de sistemas y alertas.

## Resumen

Esta plantilla crea una interfaz completa de observabilidad con métricas de panel, flujo de eventos en tiempo real y configuración de alertas.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-OBS-01 (Dashboard Overview)
- BLOCK-OBS-02 (Real-time Events)
- BLOCK-OBS-03 (Alert Configuration)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template observability-console
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
