---
contentSchemaVersion: 1
title: "AI Chat"
description: "Chat IA con interfaz conversacional, prompts y flujos de trabajo."
keywords: [ai-chat, plantilla, inicio, solid, ia, chat]
locale: es
maturity: draft
product: "AI Chat"
productLayer: template
status: draft
package: "@solidiom/template-ai-chat"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "2d5aa443e331357c39b3fd984fa2e1afb40511ea8abd01f61e0bb781fbd8c49d"
translationStatus: draft
---

AI Chat proporciona un punto de partida listo para producción para aplicaciones conversacionales impulsadas por IA.

## Resumen

Esta plantilla crea una interfaz completa de chat IA con historial de mensajes, espacio de trabajo de ingeniería de prompts y constructor visual de flujos de trabajo.

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
solidiom create my-app --template ai-chat
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
