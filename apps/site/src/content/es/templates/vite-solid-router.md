---
contentSchemaVersion: 1
title: Vite + Solid Router Starter
description: "Plantilla de inicio para proyectos vite solid router."
keywords: [vite-solid-router, plantilla, inicio, solid]
locale: es
maturity: beta
product: Vite + Solid Router Starter
productLayer: template
status: published
package: "@solidiom/template-vite-solid-router"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "7d4f549f952b3ef0680820f4f839afe0767632fff617db3d017e8159eb6fcd03"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Vite + Solid Router Starter proporciona un punto de partida listo para producción para proyectos Solid usando el stack vite solid router.

## Resumen

Esta plantilla crea un proyecto completo con enrutamiento, configuración de estilos e integración con Solidiom pre-configurada. Sirve como base para construir aplicaciones con la arquitectura vite solid router.

## Stack

- **Framework:** vite solid router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

Esta plantilla integra bloques para patrones comunes de aplicaciones, incluyendo autenticación, incorporación y gestión de recursos. Las dependencias de bloques específicas varían según la selección de portfolio.

## Autenticación

La plantilla incluye una configuración de autenticación predeterminada compatible con los bloques Sign In y Sign Up. La autenticación está configurada como una capa componible que puede reemplazarse o extenderse.

## Estilos

La plantilla se entrega con un perfil de estilo pre-configurado (CSS, Tailwind o UnoCSS). El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template vite-solid-router
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
