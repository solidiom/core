---
contentSchemaVersion: 1
title: "Workflow Automation"
description: "Automatización de flujos de trabajo con diseñador visual, historial de ejecución e integraciones."
keywords: [workflow-automation, plantilla, inicio, solid, flujos, automatización, enterprise]
locale: es
maturity: draft
product: "Workflow Automation"
productLayer: template
status: draft
package: "@solidiom/template-workflow-automation"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8"
translationStatus: draft
---

Workflow Automation proporciona un punto de partida listo para producción para construir plataformas de orquestación de flujos de trabajo sin código con diseño visual y monitoreo.

## Resumen

Esta plantilla crea una aplicación completa de automatización de flujos de trabajo con un diseñador visual drag-and-drop con triggers, condiciones y acciones, un dashboard de historial de ejecuciones con logs a nivel de paso y controles de reintento, y un gestor de integraciones para configurar conectores de terceros y webhooks.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-AI-03 (Workflow Builder)
- BLOCK-OBS-01 (Observability Overview)
- BLOCK-RESOURCE-01 (Resource List)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template workflow-automation
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
