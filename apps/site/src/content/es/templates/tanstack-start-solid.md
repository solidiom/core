---
contentSchemaVersion: 1
title: TanStack Start Solid
description: "Plantilla de inicio para proyectos tanstack start solid."
keywords: [tanstack-start-solid, plantilla, inicio, solid]
locale: es
maturity: beta
product: TanStack Start Solid
productLayer: template
status: published
package: "@solidiom/template-tanstack-start-solid"
stack: tanstack-start-solid
portfolios: ["balanced-product"]
translationSourceHash: "9027772860fe3979331922422aedd74205e3d88b2899d66ae7d66838079a8b9b"
translationStatus: draft
---

TanStack Start Solid proporciona un punto de partida listo para producción para proyectos Solid usando el stack tanstack start solid.

## Resumen

Esta plantilla crea un proyecto completo con enrutamiento, configuración de estilos e integración con Solidiom pre-configurada. Sirve como base para construir aplicaciones con la arquitectura tanstack start solid.

## Stack

- **Framework:** tanstack start solid
- **Enrutamiento:** Enrutamiento basado en archivos con TanStack Router
- **Renderizado:** SSR con hidratación
- **Herramienta de construcción:** Vite

## Bloques requeridos

Esta plantilla integra bloques para patrones comunes de aplicaciones, incluyendo autenticación, incorporación y gestión de recursos. Las dependencias de bloques específicas varían según la selección de portfolio.

## Autenticación

La plantilla incluye una configuración de autenticación predeterminada compatible con los bloques Sign In y Sign Up. La autenticación está configurada como una capa componible que puede reemplazarse o extenderse.

## Estilos

La plantilla se entrega con un perfil de estilo pre-configurado (CSS, Tailwind o UnoCSS). El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template tanstack-start-solid
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega a cualquier plataforma de alojamiento compatible con Node.js que soporte SSR. Vercel, Netlify y Cloudflare Pages son destinos soportados.
