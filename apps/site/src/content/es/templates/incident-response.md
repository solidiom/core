---
contentSchemaVersion: 1
title: "Incident Response"
description: "Respuesta a incidentes con incidentes activos, runbooks y postmortems."
keywords: [incident-response, plantilla, inicio, solid, incidentes, runbooks, enterprise]
locale: es
maturity: draft
product: "Incident Response"
productLayer: template
status: draft
package: "@solidiom/template-incident-response"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1"
translationStatus: draft
---

Incident Response proporciona un punto de partida listo para producción para construir consolas de gestión de incidentes y respuesta operativa.

## Resumen

Esta plantilla crea una aplicación completa de respuesta a incidentes con un dashboard de incidentes activos mostrando severidad, respondedores asignados y actualizaciones de línea de tiempo en tiempo real, una biblioteca de runbooks con procedimientos operativos paso a paso para escenarios comunes, y un archivo de postmortems para documentar causas raíz, líneas de tiempo y acciones de seguimiento.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-OBS-01 (Observability Overview)
- BLOCK-OBS-02 (Alert Management)
- BLOCK-OBS-03 (Event Explorer)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template incident-response
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
