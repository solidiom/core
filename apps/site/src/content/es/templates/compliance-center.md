---
contentSchemaVersion: 1
title: "Compliance Center"
description: "Centro de cumplimiento con seguimiento de marcos, evaluación de controles y recopilación de evidencia."
keywords: [compliance-center, plantilla, inicio, solid, cumplimiento, auditoría, enterprise]
locale: es
maturity: draft
product: "Compliance Center"
productLayer: template
status: draft
package: "@solidiom/template-compliance-center"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6"
translationStatus: draft
---

Compliance Center proporciona un punto de partida listo para producción para construir consolas de gestión de cumplimiento con seguimiento de marcos, evaluación de controles y recopilación de evidencia de auditoría.

## Resumen

Esta plantilla crea un centro de cumplimiento completo con seguimiento de marcos a través de SOC 2, ISO 27001, HIPAA y marcos personalizados, evaluación de controles para evaluar efectividad, asignar propietarios y rastrear remediación, y una interfaz de recopilación de evidencia para organizar y revisar artefactos de auditoría.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Role Management)
- BLOCK-ADMIN-03 (Audit Log)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template compliance-center
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
