---
contentSchemaVersion: 1
title: "Onboarding App"
description: "Aplicación de incorporación con asistentes de varios pasos y configuración guiada."
keywords: [onboarding-app, plantilla, inicio, solid, incorporacion]
locale: es
maturity: draft
product: "Onboarding App"
productLayer: template
status: draft
package: "@solidiom/template-onboarding-app"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "b2e136c0f84cdf73dd56cd22a94c87d04c823bb6f116f4b2056106fe1eca6d69"
translationStatus: draft
---

Onboarding App proporciona un punto de partida listo para producción para flujos de incorporación de usuarios guiados.

## Resumen

Esta plantilla crea un proyecto completo con asistentes de bienvenida, configuración de perfil y pasos de creación de proyecto pre-configurados con componentes y bloques de Solidiom.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-ONBOARD-01 (Welcome Wizard)
- BLOCK-ONBOARD-02 (Profile Setup)
- BLOCK-ONBOARD-03 (Project Starter)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template onboarding-app
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
