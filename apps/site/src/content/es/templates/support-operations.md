---
contentSchemaVersion: 1
title: "Support Operations"
description: "Operaciones de soporte con cola de tickets, base de conocimiento y métricas."
keywords: [support-operations, plantilla, inicio, solid, soporte, tickets, enterprise]
locale: es
maturity: beta
product: "Support Operations"
productLayer: template
status: published
package: "@solidiom/template-support-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "172b6a5fb5b580b6a82fd52bbd21f55e610b7757d526ddcf4070898cb9f9489e"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
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
