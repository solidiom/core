---
contentSchemaVersion: 1
title: "Support Operations"
description: "Operaciones de soporte con cola de tickets, base de conocimiento y métricas."
keywords: [support-operations, plantilla, inicio, solid, soporte, tickets, enterprise]
locale: es
maturity: draft
product: "Support Operations"
productLayer: template
status: draft
package: "@solidiom/template-support-operations"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"
translationStatus: draft
---

Support Operations proporciona un punto de partida listo para producción para construir consolas de soporte al cliente con gestión de tickets, conocimiento de autoservicio y seguimiento del rendimiento del equipo.

## Resumen

Esta plantilla crea una aplicación completa de operaciones de soporte con una cola de tickets para gestionar solicitudes de soporte con prioridad, asignación y seguimiento de SLA, una base de conocimiento para crear, organizar y buscar artículos de ayuda, y un dashboard de métricas para rastrear tiempos de resolución, puntuaciones CSAT y rendimiento de agentes.

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
- BLOCK-CONTENT-01 (Content Editor)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template support-operations
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
