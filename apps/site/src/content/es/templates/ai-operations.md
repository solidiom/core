---
contentSchemaVersion: 1
title: "AI Operations"
description: "Operaciones de IA con monitoreo de modelos, despliegues y seguimiento de costos."
keywords: [ai-operations, plantilla, inicio, solid, mlops, monitoreo, enterprise]
locale: es
maturity: beta
product: "AI Operations"
productLayer: template
status: published
package: "@solidiom/template-ai-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "43b1fc816553066efd2e606a307e0f033abc2f0465599aac2d300b1c8bf2569c"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

AI Operations proporciona un punto de partida listo para producción para construir consolas de MLOps y gestión de modelos de IA para equipos de plataforma.

## Resumen

Esta plantilla crea una aplicación completa de operaciones de IA con un dashboard de monitoreo de modelos rastreando rendimiento, latencia, tasas de error y deriva, un gestor de pipelines de despliegue con rollbacks, canary releases y versionamiento, y seguimiento de costos con uso de tokens, presupuestos de inferencia e informes de asignación.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-AI-01 (Chat Interface)
- BLOCK-AI-02 (Prompt Studio)
- BLOCK-AI-03 (Workflow Builder)
- BLOCK-OBS-01 (Observability Overview)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template ai-operations
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
