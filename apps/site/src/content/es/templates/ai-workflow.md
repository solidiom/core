---
contentSchemaVersion: 1
title: "AI Workflow"
description: "Automatización de flujos de trabajo IA con constructor de pipelines, registro de modelos y logs de ejecución."
keywords: [ai-workflow, plantilla, inicio, solid, ia, pipelines, automatización]
locale: es
maturity: beta
product: "AI Workflow"
productLayer: template
status: published
package: "@solidiom/template-ai-workflow"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "6238dbbda8fa6e3f1508d5e392390a300339d10515f464dbf7b7466480f7104b"
translationStatus: draft
---

AI Workflow proporciona un punto de partida listo para producción para construir interfaces de automatización de pipelines de IA multi-paso.

## Resumen

Esta plantilla crea una aplicación completa de gestión de flujos de trabajo IA con un constructor visual de pipelines para componer flujos de trabajo IA multi-paso, un registro de modelos para gestionar y versionar modelos de IA, y un visor de logs de ejecución para monitorear las ejecuciones de pipelines.

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

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template ai-workflow
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
